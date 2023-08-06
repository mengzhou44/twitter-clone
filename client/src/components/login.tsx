import { useState } from 'react';
import { useMutation, gql } from '@apollo/client';
 
const LOGIN = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input)
  }
`;

const Login = () => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [login] = useMutation(LOGIN);

  async function handleSubmit(e: any) {
    e.preventDefault();
   
    try {
      setError('')
      const res = await login({  
        variables: {
            input: {
              usernameOrEmail,
              password,
            },
          },
      });
       console.log('Logged in!')
       console.log({res})
    }  catch (e) {
        console.log(e)
        setError('Error occurred during login. Please check your credentials.');
      }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 mx-auto w-200 flex flex-col">
         {error && <p className="text-red-500 mb-3">{error}</p>}
      <div className="mb-5 flex flex-col">
        <label htmlFor="usernameOrEmail">Email Or User name</label>
        <input
          type="text"
          id="usernameOrEmail"
          className="border-2"
          value={usernameOrEmail}
          onChange={(e) => setUsernameOrEmail(e.target.value)}
        ></input>
      </div>

      <div className="mb-5 flex flex-col">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          value={password}
          className="border-2"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
      </div>
      <div className="flex ">
        <button className="bg-green-500 text-white w-20">Login</button>
      </div>
    </form>
  );
};

export default Login;
