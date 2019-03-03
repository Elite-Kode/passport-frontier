/**
 * Dependencies
 */
const OAuth2Strategy = require('passport-oauth2')
    , InternalOAuthError = require('passport-oauth2').InternalOAuthError
    , util = require('util');

/**
 * `Strategy` constructor.
 *
 * The Frontier authentication strategy authenticates requests by delegating to
 * Frontier Store via the OAuth2.0 protocol
 *
 * Applications must supply a `verify` callback which accepts an `accessToken`,
 * `refreshToken` and service-specific `profile`, and then calls the `cb`
 * callback supplying a `user`, which should be set to `false` if the
 * credentials are not valid. If an exception occurred, `err` should be set.
 *
 * Options:
 *   - `clientID`       OAuth ID to Frontier
 *   - `clientSecret`   OAuth Secret to verify client to Frontier
 *   - `callbackURL`    URL that Frontier will redirect to after auth
 *   - `scope`          Array of permission scopes to request
 *                      Check the official documentation for valid scopes to pass as an array.
 *
 * @constructor
 * @param {object} options
 * @param {function} verify
 * @access public
 */
function Strategy(options, verify) {
    options = options || {};
    options.authorizationURL = options.authorizationURL || 'https://auth.frontierstore.net/auth';
    options.tokenURL = options.tokenURL || 'https://auth.frontierstore.net/token';
    options.scopeSeparator = options.scopeSeparator || ' ';

    OAuth2Strategy.call(this, options, verify);
    this.name = 'frontier';
    this._oauth2.useAuthorizationHeaderforGET(true);
}

/**
 * Inherits from `OAuth2Strategy`
 */
util.inherits(Strategy, OAuth2Strategy);

/**
 * Retrieve user profile from Frontier.
 *
 * This function constructs a normalized profile.
 * Along with the properties returned from /me, properties returned include:
 *   - `iss`              The identifier for the identity provider who issued the token
 *   - `iat`              Issued at claim as a `Date`
 *   - `exp`              The token expiry as a `Date`
 *   - `fetchedAt`        When the data was fetched as a `Date`
 *   - `accessToken`      The access token used to fetch the (may be useful for refresh)
 *
 * @param {string} accessToken
 * @param {function} done
 * @access protected
 */
Strategy.prototype.userProfile = function (accessToken, done) {
    this._oauth2.get('https://auth.frontierstore.net/decode', accessToken, function (err, body, res) {
        if (err) {
            return done(new InternalOAuthError('Failed to fetch the user profile.', err))
        }

        try {
            let parsedData = JSON.parse(body);

            let profile = parsedData.usr; // has the /me endpoint response
            profile.iss = parsedData.iss;
            profile.iat = new Date(parsedData.iat * 1000);
            profile.exp = new Date(parsedData.exp * 1000);
            profile.provider = 'frontier';
            profile.accessToken = accessToken;

            profile.fetchedAt = new Date();
            return done(null, profile)
        } catch (e) {
            return done(new Error('Failed to parse the user profile.'));
        }
    });
};

/**
 * Return extra parameters to be included in the authorization request.
 *
 * @param {Object} options
 * @return {Object}
 * @api protected
 */
Strategy.prototype.authorizationParams = function (options) {
    let params = {};
    if (typeof options.audience !== 'undefined') {
        params.audience = options.audience;
    }
    return params;
};


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
