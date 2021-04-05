window.addEventListener("DOMContentLoaded", () => {
    const firebaseConfig = {
      apiKey: "AIzaSyBaHMwV8NKaRiousx25zJ4io2fnsRrpASM",
      authDomain: "unoinfinitywar.firebaseapp.com",
      databaseURL: "https://unoinfinitywar.firebaseio.com",
      projectId: "unoinfinitywar",
      storageBucket: "unoinfinitywar.appspot.com",
      messagingSenderId: "739172238526",
      appId: "1:739172238526:web:1e80da63d9fccf2c6d8aef",
      measurementId: "G-0BJNWCHRW5",
    };
  
    firebase.initializeApp(firebaseConfig);
  
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
  
    document.getElementById("logoutPgr").addEventListener("submit", (event) => {
      event.preventDefault();
      firebase.auth().signOut().then(function(){
        location.replace("signin");
      });
    });
  });
  