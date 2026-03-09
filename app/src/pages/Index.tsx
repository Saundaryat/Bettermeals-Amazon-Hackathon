import { useNavigate, useParams } from "react-router-dom";
import { indexStyles } from './styles/Index.styles';

export default function Index() {
  const navigate = useNavigate();
  // Remove useParams and all logic related to householdId, mealPlan, etc. (not needed for Index)

  const handleNavigateToMealPlan = () => {
    navigate("/meal-plan");
  };

  return (
    <div className={indexStyles.container}
         style={indexStyles.containerStyle}>
      <div className={indexStyles.content}>
        <span className={indexStyles.logoContainer}>
          <img src="/app/images/icon2.png" alt="Bettermeals Logo" width="90" height="90" />
        </span>
        <h1 className={indexStyles.headline}>Your Food, Your Formula</h1>
        {/* Remove overviewCard and overviewList for parity with Intro */}
        <button
          onClick={handleNavigateToMealPlan}
          className={indexStyles.ctaButton}
          style={indexStyles.ctaButtonStyle}
        > This Week's Plan →
        </button>
      </div>
    </div>
  );
}
