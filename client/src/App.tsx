import React from "react";
import { Switch, Route, Link } from "react-router-dom";

import Teacher from "./components/Teacher/Hero";
import Student from "./components/Student/Hero";

import "./App.css";
import "./tailwind.css";

const App = () => {
  return (
    <Switch>
      <Route path="/teacher" exact component={Teacher} />
      <Route path="/student" exact component={Student} />
      <Route path="/" exact>
        <div className="stdContainer h-screen bg-blue-300">
          <div className="m-auto w-full">
            <h1 className="mb-10 text-6xl lg:text-8xl text-center font-bold">
              शिक्षक
            </h1>
          </div>
          <div className="mb-auto mx-auto">
            <h3 className="text-center text-sm lg:text-3xl">Are you a</h3>
            <h4 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
              <Link
                to="/student"
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold hover:text-gray-700"
              >
                Student
              </Link>{" "}
              or{" "}
              <Link
                to="/teacher"
                className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold hover:text-gray-700"
              >
                Teacher
              </Link>
            </h4>
          </div>
        </div>
      </Route>
    </Switch>
  );
};

export default App;
