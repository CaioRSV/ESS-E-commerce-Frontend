// Funções relacionadas ao servidor

// Fetch User Info

export async function fetchMe(accessToken:string, callback:Function ) {
    return await fetch(`http://localhost:3333/api/auth/me`, {
        method: "GET",
        headers: {
              "Content-Type": "application/json",
              "Authorization": `bearer ${accessToken}`
          },
        })
        .then(res => {
            if(!res.ok){
                return false;
            }
            return res.json();
        })
        .then(data => {
            callback(data);
            return data;
        })
}

// Fetch new Access Token