import { useEffect } from "react";

const Index = () => {
  useEffect(() => {
    window.location.replace("/dashboard");
  }, []);

  return null;
};

export default Index;

