const Sigaa = require ('..');
const sigaa = new Sigaa ();

// put your crendecias
var userName = '';
var password = '';

let token;

sigaa.account
  .login (userName, password) // login
  .then (res => {
    /* res = {
      status:'LOGGED',
      userType:'STUDENT',
      token: random string
    }
    */
    if (res.userType === 'STUDENT') {
      token = res.token; // this stores access token
      return sigaa.classStudent.getClasses (res.token); // this return a array with all classes
    } else {
      throw 'user is not a student';
    }
  })
  .then (classes => {
    async function viewGrade () {
      for (let studentClass of classes) {
        let grade = await sigaa.classStudent
          .getGrades (classes[6].id, token)
          .catch (data => {
            console.log (data);
          });
        console.log(classes[6].name)
        console.log(grade)
      }
    }
    return viewGrade()
  })
  .then (data => {
    console.log (data);

    return sigaa.account.logoff (token); // logoff afeter finished downloads
  })
  .catch (data => {
    console.log (data);
  });
