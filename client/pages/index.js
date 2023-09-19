import buildClient from '../api/build-client';

const LandingPage = ({ currentUser }) => {
    if (currentUser) {
        return <h1>You are signed in</h1>;
    } else (
        <h1>You are NOT signed in</h1 >
    );
};

LandingPage.getInitialProps = async context => {
    console.log('LANDING PAGE!');
    const client = buildClient(context);
    const { data } = await client.get('/api/users/current-user');
    return data;
};

export default LandingPage;
