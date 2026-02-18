export default function LoginPage() {
  return (
    <main className="container section">
      <h1>Login</h1>
      <form className="card" action="/api/auth/login" method="post">
        <div className="card-body">
          <input required name="email" type="email" placeholder="Email" />
          <br /><br />
          <input required name="password" type="password" placeholder="Password" />
          <br /><br />
          <button type="submit">Login</button>
        </div>
      </form>
    </main>
  );
}
