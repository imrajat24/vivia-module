import TrainerPage from "./pages/Trainer/TrainerPage";
import CreateSetPage from "./pages/Trainer/CreateSetPage";
import DownloadReportPage from "./pages/Trainer/DownloadReportPage";
import VivaPage from "./pages/Trainer/VivaPage";
import VivaSummary from "./pages/Trainer/VivaSummaryPage";
import TraineePage from "./pages/Trainee/TraineePage";
import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
function App() {
  //! getting the course id from mooddle (proper lms wala part could be done in future, abhi k liye we have hardcoded it...)
  const courseId = 52;

  //! getting the userId from the system (proper lms wala part could be done in future, abhi k liye we have hardcoded it...)
  const userId = 12345;

  //! getting the admin token for API access
  const token = process.env.REACT_APP_ADMIN_TOKEN;

  //! to get the role of the user accessing the activity
  // useEffect(() => {
  //   axios
  //     .get(
  //       `spicelearnweb.xrcstaging.in/webservice/rest/server.php?wstoken=${token}&wsfunction=local_api_user_role&moodlewsrestformat=json&courseid=${courseId}&username=130281`
  //     )
  //     .then((data) => {
  //       console.log(data);
  //     });
  // });

  // ! state to get the users data

  //! States
  //* all users with their basic details
  const [users, setUsers] = useState(null);

  //* Loading State
  const [isLoading, setisLoading] = useState(true);

  //! API Call's
  function getUsers() {
    axios
      .get(
        `https://spicelearnweb.xrcstaging.in/webservice/rest/server.php?wstoken=${token}&wsfunction=local_api_enrolled_user&moodlewsrestformat=json&courseid=${courseId}}`
      )
      .then((data) => {
        getRoles(data.data.users);
      });
  }

  function getRoles(users) {
    //* getting the roles from the api and then updating the array of users with their role in the specified course
    let trainees = [];
    let promises = [];
    let k = 0;
    let i = 1;
    users.map((user) => {
      const p = new Promise((resolve, reject) => {
        setTimeout(() => {
          axios
            .get(
              `https://spicelearnweb.xrcstaging.in/webservice/rest/server.php?wstoken=${token}&wsfunction=local_api_user_role&moodlewsrestformat=json&courseid=${courseId}&username=${user.username}`
            )
            .then((data) => {
              resolve(null);
              if (data.data.roles[0].shortname === "student") {
                const trainee = {
                  name: user.username,
                  firstname: user.firstname,
                  email: user.email,
                  role: data.data.roles[0].shortname,
                };
                trainees.push(trainee);
              }
            })
            .catch((err) => console.log(err));
        }, k + 5);
      });
      promises.push(p);
      k += 5;
    });

    Promise.all(promises).then(() => {
      console.log(trainees);
      setUsers(trainees);
      setisLoading(false);
    });
  }

  //! Use Effect hooks
  //* get all the users(including trainers and trainees) present in the current course
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          exact
          element={
            <TrainerPage
              users={users}
              isLoading={isLoading}
              courseId={courseId}
              userId={userId}
              token={token}
            />
          }
        />
        <Route path="/createSet" exact element={<CreateSetPage />} />
        <Route path="/downloadReport" exact element={<DownloadReportPage />} />
        <Route path="/viva" exact element={<VivaPage />} />
        <Route path="/summary" exact element={<VivaSummary />} />
        <Route path="/trainee" exact element={<TraineePage />} />
      </Routes>
    </div>
  );
}

export default App;
