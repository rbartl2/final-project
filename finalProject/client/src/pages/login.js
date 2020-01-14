import React from 'react';
import { connect } from 'react-redux';
import Header from "../components/Nav";
import Footer from "../components/footer";

class Login extends React.Component {
  render() {
    return (
      <div className="auth-page">
        <Header />
        <div className="container page">
          <div className="row">

            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign In</h1>
              <p className="text-xs-center">
                <a>
                  Need an account?
                </a>
              </p>

              <form>
                <fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="email"
                      placeholder="Email" />
                  </fieldset>

                  <fieldset className="form-group">
                    <input
                      className="form-control form-control-lg"
                      type="password"
                      placeholder="Password" />
                  </fieldset>

                  <button
                    className="btn btn-lg btn-primary pull-xs-right"
                    type="submit">
                    Sign in
                  </button>

                </fieldset>
              </form>
            </div>

          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default connect(() => ({}), () => ({}))(Login);