/**
 * Initilize all api verions according to application release
 **/
module.exports = (app, apiBase) => {
  require('./admin_v1')(app, `${apiBase}/admin_v1`)
  require('./v1')(app, `${apiBase}/v1`)
}
