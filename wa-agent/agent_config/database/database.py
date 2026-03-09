from typing import List, Optional, Dict, Any, Union
from datetime import datetime, timedelta
from google.cloud.firestore_v1.base_query import FieldFilter
from firebase_admin import firestore
import logging
import json

# Configure logging
logger = logging.getLogger(__name__)


class Database:
    """Database layer for managing health-related data in Firestore"""
    
    def __init__(self):
        """Initialize database connection"""
        try:
            logger.info("Initializing database connection")
            # Uses the default app initialized in main.py
            self.db = firestore.client()
            logger.info("Database connection initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize database connection: {str(e)}")
            raise

    def _normalize_phone_number(self, phone_number: str) -> str:
        """Normalize phone number to format: 919639293454 (no + prefix, with 91 country code)
        
        Handles:
        - 9639293454 -> 919639293454 (adds 91 prefix)
        - +919639293454 -> 919639293454 (removes + prefix)
        - 919639293454 -> 919639293454 (already correct)
        """
        if not phone_number:
            return phone_number
        
        # Remove + prefix if present
        normalized = phone_number.lstrip('+')
        
        # Remove any non-digit characters (spaces, dashes, etc.)
        normalized = ''.join(filter(str.isdigit, normalized))
        
        # Ensure it starts with 91
        if not normalized.startswith('91'):
            normalized = f"91{normalized}"
        
        # Validate: should be exactly 12 digits (91 + 10 digits)
        if len(normalized) != 12 or not normalized.isdigit():
            logger.warning(f"Invalid phone number format after normalization: {phone_number} -> {normalized} (expected 12 digits)")
            # Still return normalized value, but log warning
        
        return normalized

    #######################################
    ######## HOUSEHOLD ##########
    #######################################

    def find_user_by_phone(self, phone_number: str):
        """Find user by WhatsApp phone number"""
        try:
            if not phone_number:
                return None
            
            normalized_phone = self._normalize_phone_number(phone_number)
            logger.debug(f"Searching for user with phone number: {normalized_phone}")
            
            # 1. Search in 'user' collection
            users_ref = self.db.collection("user")
            # Handle potentially inconsistent phone formats in DB (+ prefix)
            search_phones = [normalized_phone, f"+{normalized_phone}"]
            docs = list(users_ref.where("phone_number", "in", search_phones).limit(1).stream())
            
            if not docs:
                logger.debug(f"No user found with phone number: {normalized_phone}")
                return None
            
            # Process user doc
            user_doc = docs[0]
            user_data = user_doc.to_dict()
            user_data["id"] = user_doc.id
            
            logger.debug(f"Found user: {user_data['id']}")
            return user_data
            
        except Exception as e:
            logger.error(f"Error finding user by phone {phone_number}: {e}")
            raise

    def get_household_data(self, household_id: str):
        """Get household data by ID"""
        try:
            logger.debug(f"Retrieving household data for ID: {household_id}")
            household_ref = self.db.collection("household")
            doc = household_ref.document(household_id).get()
            
            if not doc.exists:
                logger.debug(f"No household found with ID: {household_id}")
                return None
                
            data = doc.to_dict()
            data["id"] = doc.id
            logger.debug(f"Successfully retrieved household data for ID: {household_id}")
            return data
            
        except Exception as e:
            logger.error(f"Error retrieving household data for ID {household_id}: {str(e)}")
            raise

    def save_user_message(self, phone_number: str, message_data: Dict[str, Any]) -> bool:
        """Save user agent message to database"""
        try:
            # Normalize phone number to expected format
            normalized_phone = self._normalize_phone_number(phone_number)
            logger.debug(f"Saving user agent message for phone: {normalized_phone}")
            messages_ref = self.db.collection("user_agent_messages")
            
            message_data["phone_number"] = normalized_phone
            message_data["timestamp"] = datetime.now()
            
            messages_ref.add(message_data)
            logger.debug(f"Successfully saved user agent message for phone: {normalized_phone}")
            return True
        except Exception as e:
            logger.error(f"Error saving user agent message for phone {phone_number}: {str(e)}")
            return False

    def get_recent_messages(self, phone_number: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent messages for a phone number
        
        Args:
            phone_number: User's phone number
            limit: Number of recent messages to return
            
        Returns:
            List of message dicts sorted chronologically (oldest to newest)
        """
        normalized_phone = self._normalize_phone_number(phone_number)
        logger.debug(f"Fetching recent messages for phone: {normalized_phone}")
        messages_ref = self.db.collection("user_agent_messages")
        
        try:
            # Optimize: Try Database-side sorting first (Requires Composite Index)
            query = (messages_ref
                    .where(filter=FieldFilter("phone_number", "==", normalized_phone))
                    .order_by("timestamp", direction=firestore.Query.DESCENDING)
                    .limit(limit))
            
            docs = list(query.stream())
            # If successful, we strictly trust the DB result
            messages = [doc.to_dict() for doc in docs]
            
        except Exception as e:
            logger.warning(f"Database sort failed (likely missing index), falling back to in-memory sort. Error: {e}")
            try:
                # Fallback: Fetch all for user (warning: performance hit on large history) and sort in memory
                # Only strictly necessary if the composite index is missing
                # We apply a generous limit to avoid fetching MILLIONS of records if they exist
                query = messages_ref.where(filter=FieldFilter("phone_number", "==", normalized_phone)).limit(100)
                docs = list(query.stream())
                
                all_msgs = []
                for doc in docs:
                    data = doc.to_dict()
                    # ensure timestamp exists
                    if "timestamp" in data:
                        all_msgs.append(data)
                
                # Sort in memory: Newest First
                all_msgs.sort(key=lambda x: x["timestamp"], reverse=True)
                messages = all_msgs[:limit]
                
            except Exception as e2:
                logger.error(f"Critical error fetching messages for {phone_number}: {e2}")
                return []
            
        # Reverse to get chronological order (oldest -> newest)
        messages.reverse()
        
        logger.info(f"Retrieved {len(messages)} recent messages for {normalized_phone}")
        return messages

# -------------------- Singleton Instance -------------------- #
_db_instance = None
_db_lock = None

def get_db() -> Database:
    """Get singleton instance of Database"""
    global _db_instance, _db_lock
    
    if _db_lock is None:
        import threading
        _db_lock = threading.Lock()
    
    if _db_instance is None:
        with _db_lock:
            # Double-check pattern to avoid race conditions
            if _db_instance is None:
                try:
                    logger.info("Creating new database instance")
                    _db_instance = Database()
                except Exception as e:
                    logger.error(f"Failed to create database instance: {str(e)}")
                    raise
    
    return _db_instance
