import React, { useState } from "react";

import Teacher from "./components/Teacher/Hero";
import Student from "./components/Student/Hero";

import "./tailwind.css";

const App = () => {
  const [isTeacher, setIsTeacher] = useState<boolean>(true);

  const toggleIsTeacher = () => {
    setIsTeacher(!isTeacher);
  };

  return (
    <>
      <button onClick={toggleIsTeacher}>
        change to {!isTeacher ? "teacher" : "student"}
      </button>
      {isTeacher ? <Teacher /> : <Student />}
    </>
  );
};

export default App;
