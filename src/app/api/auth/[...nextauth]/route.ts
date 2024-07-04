import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";

export const handler = NextAuth({
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied

        const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/login`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          body: JSON.stringify({
              "email": credentials?.email,
              "password": credentials?.password
              })
          })
          .then(res => {return res.json()})
          .then(data => {console.log(data);return data})

        const user = await res;

        //console.log(user);
  
        if (user.accessToken) {
          // Returning what we want
          return user
        } else {
          // Returning null allows error to be shown
          return null
          }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }){
        return { ...token, ...user}
    },
    async session({ session, token, user }){
      session.user = token as any;
      return session;
    }
  }
  , session: {
    strategy: "jwt",
    maxAge:  3 * 24 * 60 * 60, // Default client user session expiration - 3 days
    // maxAge:  5, // 5 sec for testing

  }
})

export { handler as GET, handler as POST }