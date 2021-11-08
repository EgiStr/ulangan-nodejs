export default function (
  username,
  email,
  password,
  password2,
  role = "siswa"
) {
  return {
    username,
    email,
    password,
    password2,
    role,
  };
}
