'use strict'

//This handles retrieving data and is used by controllers. 3 options (server, factory, provider) with
//each doing the same thing just structuring the functions/data differently.
Application.Services.service('usersService', function () {
    this.getUsers = function (callback) {
        var callback = callback || function(){};
        // callback(users);
        $.get('http://localhost:1337/user', function(data) {
          // console.log(JSON.stringify(data));
          callback(data);
        });
    };

    this.insertUser = function (name, email, callback) {
        var callback = callback || function(){};
        $.post('http://localhost:1337/user', { name: name, email: email }, function(data) {
          // users.push({
          //     id: data.id,
          //     name: data.name,
          //     email: data.email
          // });
          callback(data);
        });
    };

    this.deleteUser = function (id, callback) {
        var callback = callback || function(){};
        // for (var i = customers.length - 1; i >= 0; i--) {
        //     if (customers[i].id === id) {
        //         customers.splice(i, 1);
        //         break;
        //     }
        // }

        $.post('http://localhost:1337/user/destroy', { id: id }, function(data) {
          callback(data);
        });
    };

    this.getCustomer = function (id) {
        for (var i = 0; i < customers.length; i++) {
            if (customers[i].id === id) {
                return customers[i];
            }
        }
        return null;
    };

});

Application.Services.service("userService", ["ngResource"]).factory("User", function ($resource) {
  return $resource(
     "/user/:id", {id: "@id" }, {
        update: { method: 'PUT'}
      }
  );

  // return $resource(
  //    "/user/:id", { id: "@id" }, {
  //       index: { method: 'GET', isArray: true },
  //       new: { method: 'GET' },
  //       create: { method: 'POST' },
  //       show: { method: 'GET' },
  //       edit: { method: 'GET' },
  //       update: { method: 'PUT' },
  //       destroy: { method: 'DELETE' }
  //     }
  // );

});