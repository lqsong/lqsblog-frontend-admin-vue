const mockjs= require('mockjs');
const { VUE_APP_APIHOST } = process.env;
const ajaxHeadersTokenKey = 'x-token';
const mock = {};

mock[`GET ${VUE_APP_APIHOST}/user/info`] = (req, res) => {
    const headers = req.headers;
    if (headers[ajaxHeadersTokenKey] === 'admin') {
        res.send({
          code: 0,
          data: {
            id: 1,
            name: 'Admins',
            avatar: '',
            resources: [
              "admin"
            ],
            roles: [
              "系统管理员"
            ]
          },
        });
    } else {
        res.send({
          code: 10002,
          data: {},
          msg: '未登录',
        });
    }

};

mock[`GET ${VUE_APP_APIHOST || ''}/user/message`] = (req, res) => {
    res.send({
      code: 0,
      data: mockjs.mock('@integer(0,99)'),
    });
};
  
mock[`POST ${VUE_APP_APIHOST || ''}/user/login`] = (req, res) => {
    const { password, username } = req.body;
    const send = { code: 0, data: {}, msg: '' };
    if (username === 'admin' && password === '123456') {
        send['data'] = {
        token: 'admin',
        };
    } else if (username === 'user' && password === '123456') {
        send['data'] = {
        token: 'user',
        };
    } else if (username === 'test' && password === '123456') {
        send['data'] = {
        token: 'test',
        };
    } else {
        send['code'] = 201;
        send['msg'] = 'Wrong username or password';
    }

    res.send(send);
};
  
mock[`POST ${VUE_APP_APIHOST || ''}/user/register`] = (req, res) => {
    res.send({
      code: 0,
      data: '',
      msg: '',
    });
};
  

module.exports = {
  ...mock
};