import { useQuery, gql } from '@apollo/client';

const USERS_QUERY = gql`
  query {
    users {
      id
      username
      email
    }
  }
`;


type User = {
  id: number;
  username: string;
  email: string;
};

const UsersList = () => {
  const { loading, error, data } = useQuery(USERS_QUERY);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error occurred: {error.message}</div>;

  return (
    <div>
      <h1>All Users</h1>
      <ul>
        {data.users.map((user: User) => (
          <li key={user.id}>
            <strong>{user.username}</strong> {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
