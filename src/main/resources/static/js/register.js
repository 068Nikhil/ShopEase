async function register() {
    
    try {
        let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let pass = document.getElementById("password").value;

    let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let passPattern = /^.{6,}$/;


    if(name == "")  {
        document.getElementById("error-name").innerText = "*Name can't be empty";
        document.getElementById("name").focus();
        return;
    }
    document.getElementById("error-name").innerText = "";

    if(email == "")  {
        document.getElementById("error-email").innerText = "*Email can't be empty";
        document.getElementById("email").focus();
        return;
    }
    if(!emailPattern.test(email)) {
        document.getElementById("error-email").innerText = "*Please enter a valid Email";
        document.getElementById("email").focus();
        return;
    }

    document.getElementById("error-email").innerText = "";

    if(pass == "")  {
        document.getElementById("error-pass").innerText = "*Please give a Password";
        document.getElementById("password").focus();
        return;
    }
    if(!passPattern.test(pass)) {
        document.getElementById("error-pass").innerText = "*Password should be minimum 6 characters";
        document.getElementById("password").focus();
        return;
    }

    document.getElementById("error-pass").innerText = "";
    
    
    

    const response = await fetch("/users/register", {
        method : "POST",
        headers : {
            "Content-Type" : "application/json"
        },
        body : JSON.stringify({
            name : name,
            email : email,
            password : pass,
        }),
    });

     const text = await response.text();
     const result = text ? JSON.parse(text) : null;

    if(result != null) {
        console.log("New User Registered");
        alert("Registration Successful, Go to Login Page");
        window.location.href = "login.html";
    } else {
        alert("User already exists!");
    }
    } catch(error) {
        console.log("error while registering")
    }
}