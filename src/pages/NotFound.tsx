import { Link } from "react-router";

export default function NotFoundPage() {
  return (
    <div>
      <h1>Not found page</h1>
      <Link to="/">
        <button>Go back home</button>
      </Link>
    </div>
  );
}
