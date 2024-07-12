import 'dart:convert';

import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:flutter/widgets.dart';
import 'package:poosd/models/user.dart';
import 'package:http/http.dart' as http;
import 'package:poosd/pages/calendar.dart';
import 'package:poosd/providers/user_provider.dart';
import 'package:poosd/utils/constants.dart';
import 'package:poosd/utils/utils.dart';
import 'package:provider/provider.dart';
//import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  void signUpUser({
    required BuildContext context,
    required String login,
    required String password,
    required String firstname,
    required String lastname,
    required String email,
    required String phone,
  }) async {
    try {
      User user = User(login: login, password: password, firstname: firstname, lastname: lastname, email: email, phone: phone);

      http.Response res = await http.post(
        Uri.parse('${Constants.uri}/api/signup'),
        body: user.toJson(),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
      );

      httpErrorHandle(
        response: res, 
        context: context, 
        onSuccess: () {
          showSnackBar(context, 'Account created! \nCheck your email to verify your account,\n then login with the same credentials!',);
        },
      );

    } catch (e) {
      showSnackBar(context, e.toString());
    }
  }


  void signInUser({
    required BuildContext context,
    required String login,
    required String password,

  }) async {
    try {
      var userProvider = Provider.of<UserProvider>(context, listen: false );
      final navigator = Navigator.of(context);

      http.Response res = await http.post(
        Uri.parse('${Constants.uri}/api/login'),
        body: jsonEncode({
          'login': login,
          'password': password,
        }),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
      );

      httpErrorHandle(
        response: res, 
        context: context, 
        onSuccess: () async {
          //SharedPreferences prefs = await SharedPreferences.getInstance();
          userProvider.setUser(res.body);
          //await prefs.setString('x-auth-token', jsonDecode(res.body)['token']);
          navigator.pushAndRemoveUntil(
            MaterialPageRoute(
              builder: (context) => const CalendarFormScreen(),
            ),
            (route) => false,
          );
        },
      );

    } catch (e) {
      showSnackBar(context, e.toString());
    }
  }
}
