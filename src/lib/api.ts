// Funções relacionadas ao servidor

// Fetch User Info

export async function fetchMe(accessToken:string, callback:Function ) {
    return await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/me`, {
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

export async function registerUser(data: {
    email: string;
    name: string;
    password: string;
}) {
    return await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    })
    .then(res => {
        return res.json();
    })
    .then(data => {
        return data;
    })
}