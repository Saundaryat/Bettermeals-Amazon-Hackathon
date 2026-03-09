import React, { useEffect, useState } from "react";
import { StepTransition } from "@/components/StepTransition";
import ProgressBar from "@/components/ProgressBar";
import { useNavigate } from "react-router-dom";
import { paymentCheckoutStyles } from "./styles/PaymentCheckout.styles";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/httpClient";
import { useHouseholdDashboardInfo } from "@/hooks/useHouseholdData";

function formatTime(sec: number) {
  const min = Math.floor(sec / 60);
  const s = (sec % 60).toString().padStart(2, "0");
  return `${min}:${s}`;
}

export default function PaymentCheckout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const householdId = user?.household_id;

  const { data: dashboardInfo, isLoading } = useHouseholdDashboardInfo(householdId || null);

  const [isTimerStarted, setIsTimerStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 300 -> 5 minutes in seconds

  useEffect(() => {
    if (isTimerStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate("/success");
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isTimerStarted, timeLeft, navigate]);

  const handleStartPayment = async () => {
    if (!householdId) {
      console.error("Missing household ID");
      return;
    }

    setIsTimerStarted(true);

    try {
      // Assuming the ID required here is the household ID or a specific order ID.
      // Based on previous code using 'config.id', and typical flows, it might be householdId.
      // If it's a specific order ID, we might need to fetch it first or it might be in dashboardInfo.
      const result = await api.post(`household/grocery/place_order/${householdId}`, {}, {
        requireAuth: true
      });

      if (result.success) {
        // Success handling
      } else {
        console.error("Failed to place order:", result.error);
      }
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  if (isLoading) {
    return (
      <StepTransition>
        <div className={paymentCheckoutStyles.container}>
          <div className="flex justify-center items-center h-64">
            Loading checkout details...
          </div>
        </div>
      </StepTransition>
    );
  }

  const address = dashboardInfo?.household?.address || "[No address provided]";
  // UPI ID is not currently in the dashboard info, using fallback or would need to be added to API
  const upiId = "xyz@ybl";

  return (
    <StepTransition>
      <div className={paymentCheckoutStyles.container}>
        <ProgressBar step={3} total={4} />
        {/* Headline */}
        <div className={paymentCheckoutStyles.headlineSection}>
          <h1 className={paymentCheckoutStyles.headline}>Confirm your details.</h1>
          <p className={paymentCheckoutStyles.headlineSubtitle}>
            After your confirmation, you will receive a payment request on your UPI ID within 5-10 mins.
          </p>
        </div>

        {/* Timer display when started */}
        {isTimerStarted && (
          <div className={paymentCheckoutStyles.timerSection}>
            <div className={paymentCheckoutStyles.timerBarBg}>
              <div
                className={paymentCheckoutStyles.timerBar}
                style={{ width: `${Math.max((timeLeft / 300) * 100, 3)}%` }}
              />
            </div>
            <div className={paymentCheckoutStyles.timerTextRow}>
              <span className={paymentCheckoutStyles.timerLabel}>Time left:</span>
              <span className={paymentCheckoutStyles.timerValue}>{formatTime(timeLeft)}</span>
            </div>
            <div className={paymentCheckoutStyles.timerNote}>
              Complete payment within time limit
            </div>
          </div>
        )}

        {/* Delivery window preview */}
        <div className={paymentCheckoutStyles.deliveryWindowSection}>
          <div>
            <span className={paymentCheckoutStyles.deliveryWindowLabel}>Delivery Window:</span>
            <span className={paymentCheckoutStyles.deliveryWindowValue}>Tomorrow, 9–11 AM</span>
          </div>
          <div>
            <span className={paymentCheckoutStyles.deliveryWindowLabel}>Address:</span>
            <span>{address}</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className={paymentCheckoutStyles.paymentSection}>
          <div className={paymentCheckoutStyles.paymentTitle}>Payment Method</div>
          <div className={paymentCheckoutStyles.paymentOptions}>
            <div className={paymentCheckoutStyles.paymentOptionRow}>
              <input type="radio" name="payment" checked readOnly className={paymentCheckoutStyles.paymentRadio} />
              <span className={paymentCheckoutStyles.paymentOptionLabel}>UPI Payment</span>
            </div>
            <div className={paymentCheckoutStyles.upiDetailsSection}>
              <div className={paymentCheckoutStyles.upiDetailsLabel}>
                Sending payment request to UPI ID:
              </div>
              <div className={paymentCheckoutStyles.upiDetailsCodeRow}>
                <code className={paymentCheckoutStyles.upiDetailsCode}>
                  {upiId}
                </code>
              </div>
              <div className={paymentCheckoutStyles.upiDetailsNote}>
                Google Pay, PhonePe, or BHIM
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        {!isTimerStarted && (
          <div className={paymentCheckoutStyles.actionButtonRow}>
            <button
              className={paymentCheckoutStyles.backButton}
              onClick={() => navigate("/grocery-list")}
            >
              &larr; Back
            </button>
            <button
              className={paymentCheckoutStyles.startPaymentButton}
              onClick={handleStartPayment}
            >
              Confirm Order →
            </button>
          </div>
        )}
      </div>
    </StepTransition>
  );
}
