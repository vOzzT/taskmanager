// ignore_for_file: use_build_context_synchronously, duplicate_ignore

import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:poosd/models/user.dart';
import 'package:http/http.dart' as http;
import 'package:poosd/pages/calendar.dart';
import 'package:poosd/providers/user_provider.dart';
import 'package:poosd/services/event_services.dart';
import 'package:poosd/utils/constants.dart';
import 'package:poosd/utils/utils.dart';
import 'package:provider/provider.dart';

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
        // ignore: use_build_context_synchronously
        context: context, 
        onSuccess: () {
          showSnackBar(context, 'Account created! \nCheck your email to verify your account,\nthen login with the same credentials!',);

          var responseData = json.decode(res.body);

            String ret = responseData["id"].toString();

            user.setId(ret);
        },
      );



    } catch (e) {
      // ignore: use_build_context_synchronously
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
      final user = Provider.of<UserProvider>(context, listen: false).user;
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
          userProvider.setUser(res.body);

          var responseData = json.decode(res.body);
          String ret = responseData["token"].toString();
          user.setToken(ret);

          getData(context: context, token: user.getToken());

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

  void getData({
    required BuildContext context,
    required String token,

  }) async {
    try {
      //var userProvider = Provider.of<UserProvider>(context, listen: false );
      final user = Provider.of<UserProvider>(context, listen: false).user;
      final EventServices eventService = EventServices();
      
      http.Response res = await http.get(
        Uri.parse('${Constants.uri}/api/data'),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
          'Accept': 'application/json',
          'Authorization': 'Bearer $token',
        },
      );

      httpErrorHandle(
        response: res, 
        context: context, 
        onSuccess: () async {
          //SharedPreferences prefs = await SharedPreferences.getInstance();
         
          var responseData = json.decode(res.body);
          String ret = responseData["id"].toString();
          user.setId(ret);

          eventService.apiGetEvents(context: context, theId: user.userEyeD);
          //await prefs.setString('x-auth-token', jsonDecode(res.body)['token']);
          
        },
      );

    } catch (e) {
      showSnackBar(context, e.toString());
    }
  }

  void forgotPassword({
    required BuildContext context,
    required String email,

  }) async {
    try {
      
      http.Response res = await http.post(
        Uri.parse('${Constants.uri}/api/forgot-password'),
        body: jsonEncode({
          'email': email,
        }),
        headers: <String, String>{
          'Content-Type': 'application/json; charset=UTF-8',
        },
      );

      httpErrorHandle(
        response: res, 
        context: context, 
        onSuccess: () async {
          showSnackBar(context, "Please check your email\n for further instructions");
        },
      );

    } catch (e) {
      showSnackBar(context, e.toString());
    }
  }
}
