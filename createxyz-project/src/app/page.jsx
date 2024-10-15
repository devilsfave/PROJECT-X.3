"use client";
import React from "react";
import ButtonStyling from "../components/ButtonStyling";


function MainComponent() {
  const [user, setUser] = React.useState(null);
  const [theme] = React.useState("light");
  const [activeTab, setActiveTab] = React.useState("login");
  const [showAuth, setShowAuth] = React.useState(false);
  const [currentTab, setCurrentTab] = React.useState("home");
  const [analysisResult, setAnalysisResult] = React.useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [showCamera, setShowCamera] = React.useState(false);

  React.useEffect(() => {
    window.fbAsyncInit = function () {
      FB.init({
        appId: process.env.REACT_APP_FACEBOOK_APP_ID,
        cookie: true,
        xfbml: true,
        version: "v12.0",
      });

      FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
      var js,
        fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {
        return;
      }
      js = d.createElement(s);
      js.id = id;
      js.src = "https://connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    })(document, "script", "facebook-jssdk");
  }, []);

  const renderTab = () => {
    switch (currentTab) {
      case "home":
        return (
          <HomeComponent
            setCurrentTab={setCurrentTab}
            setShowCamera={setShowCamera}
          />
        );
      case "analysis":
        return (
          <AnalysisComponent
            setAnalysisResult={setAnalysisResult}
            setCurrentTab={setCurrentTab}
            setShowCamera={setShowCamera}
          />
        );
      case "results":
        return <ResultsComponent analysisResult={analysisResult} />;
      case "appointments":
        return <AppointmentsComponent />;
      case "education":
        return <EducationComponent />;
      default:
        return (
          <HomeComponent
            setCurrentTab={setCurrentTab}
            setShowCamera={setShowCamera}
          />
        );
    }
  };

  const WelcomePage = ({ setShowAuth }) => (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <h1 className="text-4xl font-bold mb-6 text-[#EFEFED]">Welcome to DermaVision AI</h1>
      <p className="text-xl mb-8 text-[#EFEFED] max-w-2xl">
        Unlock the power of AI for advanced skin analysis. Take control of your skin health with our cutting-edge technology, providing personalized insights and recommendations.
      </p>
      <ButtonStyling 
        text="Get Started" 
        onClick={() => setShowAuth(true)}
        className="text-lg px-8 py-3 bg-[#3B82F6] hover:bg-[#2563EB] transition-colors duration-300"
      />
    </div>
  );

  return (
    <div
      className={`font-poppins text-[#EFEFED] ${theme === "light" ? "bg-[#0D111D]" : "bg-[#0D111D]"}`}
    >
      <header className="p-4 border-b border-[#262A36]">
        {/* Header content */}
      </header>

      {user && (
        <MobileMenu
          isOpen={mobileMenuOpen}
          setCurrentTab={setCurrentTab}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      )}

      <main className="container mx-auto p-4">
        {!user ? (
          showAuth ? (
            <AuthComponent
              setUser={setUser}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          ) : (
            <WelcomePage setShowAuth={setShowAuth} />
          )
        ) : showCamera ? (
          <CameraComponent
            setShowCamera={setShowCamera}
            setAnalysisResult={setAnalysisResult}
            setCurrentTab={setCurrentTab}
          />
        ) : (
          renderTab()
        )}
      </main>

      <footer className="bg-[#171B26] text-[#EFEFED] p-4 mt-8">
        {/* Footer content */}
      </footer>
    </div>
  );
}

export default MainComponent;
