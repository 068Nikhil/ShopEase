async function logout() {
  try {

    let response = await fetch("/users/logout", {
      method: "POST",
      credentials: "include"
    });

    if(response.ok) {
      alert("Logged out successfully");
      window.location.href = "index.html";
    } else {
      let msg = await response.text();
      alert("Error: " + msg);
    }
    
  } catch (error) {
    console.log("error logging out");
  }
}
