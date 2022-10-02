const url = require('url');
const ejs = require('ejs');
const path = require('path');
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const Strategy = require('passport-discord').Strategy
const app = express();
const MemoryStore = require('memorystore')(session);
const resindex = require('./res/resindex');

module.exports = (client) => {
  try{
    const dataDir = path.resolve(`${process.cwd()}${path.sep}src${path.sep}src`);
    const templateDir = path.resolve(`${dataDir}${path.sep}web`);
    const assetsDir = path.resolve(`${dataDir}${path.sep}assets`);
    passport.serializeUser((user, done) => done(null, user));
    passport.deserializeUser((obj, done) => done(null, obj));
    let domain
    let callbackUrl
    const domainUrl = new URL(client.config.domain);
    domain = {
      host: domainUrl.hostname,
      protocol: domainUrl.protocol,
    }
    if (client.config.usingCustomDomain) {
      callbackUrl = `${domain.protocol}//${domain.host}/callback`
    } else {
      callbackUrl = `${domain.protocol}//${domain.host}${client.config.port == 80 ? "" : `:${client.config.port}`}/callback`
    }
    passport.use(
      new Strategy(
        {
          clientID: client.config.id,
          clientSecret: client.config.clientSecret,
          callbackURL: callbackUrl,
          scope: ["identify", "guilds"],
        },
        (accessToken, refreshToken, profile, done) => {
          process.nextTick(() => done(null, profile))
        }
      )
    )
    app.use(
      session({
        store: new MemoryStore({ checkPeriod: 86400000 }),
        secret: "#@%#&^$^$%@$^$&%#$%@#$%$^%&$%^#$%@#$%#E%#%@$FEErfgr3g#%GT%536c53cc6%5%tv%4y4hrgrggrgrgf4n",
        resave: false,
        saveUninitialized: false,
      })
    )
    app.use(passport.initialize())
    app.use(passport.session())
    app.locals.domain = client.config.domain.split("//")[1]
    app.engine("ejs", ejs.renderFile)
    app.set("view engine", "ejs")
    app.use(bodyParser.json())
    app.use(
      bodyParser.urlencoded({
        extended: true,
      })
    )
    app.use("/", express.static(assetsDir))
    const renderTemplate = (res, req, template, data = {}) => {
      const baseData = {
        bot: client,
        path: req.path,
        user: req.isAuthenticated() ? req.user : null,
      }
      res.render(path.resolve(`${templateDir}${path.sep}${template}`), Object.assign(baseData, data))
    }
    const checkAuth = (req, res, next) => {
      if (req.isAuthenticated()) return next()
      req.session.backURL = req.url
      res.redirect("/login")
    }
    app.get(
      "/login",
      (req, res, next) => {
        if (req.session.backURL) {
          req.session.backURL = req.session.backURL
        } else if (req.headers.referer) {
          const parsed = url.parse(req.headers.referer)
          if (parsed.hostname === app.locals.domain) {
            req.session.backURL = parsed.path
          }
        } else {
          req.session.backURL = "/"
        }
        next()
      },
      passport.authenticate("discord")
    )
    app.get(
      "/callback",
      function (req, res, next) {
        return passport.authenticate("discord", { failureRedirect: "/" }, async function (err, user, info) {
          if (err) {
            console.error(err)
            return res.redirect("/")
          }

          req.login(user, function (e) {
            if (e) return next(e)
            return next()
          })
        })(req, res, next)
      },
      (req, res) => {
        if (req.session.backURL) {
          const backURL = req.session.backURL
          req.session.backURL = null
          res.redirect(backURL)
        } else {
          res.redirect("/")
        }
      }
    )
    app.get("/logout", function (req, res) {
      req.logout(function (err) {
        if (err) {
          return next(err)
        }
        res.redirect("/")
      })
    })
    resindex(checkAuth, app, client, renderTemplate)
  app.listen(client.config.port)
} catch (e) { return }
}