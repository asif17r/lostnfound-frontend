
const LandingPage: React.FC = () => {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Welcome to Lost & Found</h1>
                <p>Your one-stop solution to find lost items or report found items.</p>
            </header>
            <main>
                <section>
                    <h2>About Us</h2>
                    <p>
                        At Lost & Found, we aim to reunite lost items with their rightful owners. 
                        Whether you've lost something or found an item, our platform helps you connect with others to recover lost belongings.
                    </p>
                </section>
                <section>
                    <h2>How It Works</h2>
                    <p>
                        Browse through the list of found items or search for your lost item. 
                        If you find a match, contact the person who found it to arrange a return.
                    </p>
                </section>
                <section>
                    <h2>Login to Post</h2>
                    <p>
                        To post a lost or found item, please <a href="/login">login</a> to your account. 
                        If you don't have an account, you can <a href="/signup">sign up</a> for free.
                    </p>
                </section>
            </main>
            <footer>
                <section>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                </section>
                <p>&copy; 2025 Lost & Found. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default LandingPage;