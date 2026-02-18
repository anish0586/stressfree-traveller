export default function SignupPage() {
  return (
    <main className="container section">
      <h1>Create account</h1>
      <form className="card" action="/api/auth/signup" method="post">
        <div className="card-body">
          <input required name="name" type="text" placeholder="Name" />
          <br /><br />
          <input required name="email" type="email" placeholder="Email" />
          <br /><br />
          <input required name="password" type="password" placeholder="Password" />
          <br /><br />
          <button type="submit">Sign up</button>
        </div>
      </form>
    </main>
  );
}
