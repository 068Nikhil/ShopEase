async function login() {

  try {

    let email = document.getElementById("email").value;
    let pass = document.getElementById("password").value;

    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;

    if (email == "") {
      document.getElementById("error-email").innerText =
        "*Email can't be empty";
      document.getElementById("email").focus();
      return;
    }
    if (!emailPattern.test(email)) {
      document.getElementById("error-email").innerText = "*Invalid Email Id";
      document.getElementById("email").focus();
      return;
    }
    document.getElementById("error-email").innerText = "";


    if (pass == "") {
      document.getElementById("error-pass").innerText =
        "*Please enter your Password";
      document.getElementById("password").focus();
      return;
    }
    document.getElementById("error-pass").innerText = "";


    const response = await fetch("/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: pass,
      }),
      credentials : "include"
    });


    if(response.ok) {

      alert("Logged in successfully");
      window.location.href = "welcome.html";

    } else if(response.status == 400){

      alert("Invalid Credentials!");

    } else {

      alert("Something went wrong: " + response.status);

    }


  } catch (error) {
    console.log("error logging in");
  }
}
