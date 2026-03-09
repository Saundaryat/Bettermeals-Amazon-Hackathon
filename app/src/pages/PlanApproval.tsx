import React, { useEffect } from "react";
import { StepTransition } from "@/components/StepTransition";
import ProgressBar from "@/components/ProgressBar";
import Confetti from "@/components/Confetti";
import { useNavigate } from "react-router-dom";
import { planApprovalStyles } from "./styles/PlanApproval.styles";


export default function PlanApproval() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <StepTransition>
      <div className={planApprovalStyles.container}>
        {/* <ProgressBar step={3} total={3} /> */}
        <div className={planApprovalStyles.content}>
          <div className={planApprovalStyles.iconContainer}>
            <div className={planApprovalStyles.icon}>
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          
          <h1 className={planApprovalStyles.headline}>
            Plan Approved!
          </h1>
          
          <p className={planApprovalStyles.subtitle}>
            Your meal plan is approved and groceries are processing. 
          </p>
          
          <div className={planApprovalStyles.notificationCard}>
            <div className={planApprovalStyles.notificationIcon}>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-5 5v-5zM4.19 4.19A2 2 0 006 3h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V5a2 2 0 012-2z"
                />
              </svg>
            </div>
            <div className={planApprovalStyles.notificationText}>
              <p className="text-sm">You’ll soon receive a message on your phone with a link to your grocery list. Review and order your groceries in just a few clicks.</p>
            </div>
          </div>
          
          <div className={planApprovalStyles.buttonContainer}>
            <button
              className={planApprovalStyles.primaryButton}
              onClick={() => navigate("/meal-plan")}
            >
              View Meal Plan
            </button>
            {/* <button
              className={planApprovalStyles.secondaryButton}
              onClick={() => navigate("/grocery-list")}
            >
              View Grocery List
            </button> */}
          </div>
          
          <div className={planApprovalStyles.footer}>
            <p className="text-sm font-medium">
              Estimated delivery: <b>Tomorrow, 9-11 AM</b>
            </p>
          </div>
        </div>
      </div>
    </StepTransition>
  );
} 