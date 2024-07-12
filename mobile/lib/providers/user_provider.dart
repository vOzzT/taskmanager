import 'package:flutter/material.dart';
import 'package:poosd/models/user.dart';

class UserProvider extends ChangeNotifier {
  User _user = User(login: '', password: '', firstname: '', lastname: '', email: '', phone: '');

  User get user => _user;

  void setUser(String user) {
    _user = User.fromJson(user);
    notifyListeners();
  } 

  void setUserfromModel(User user) {
    _user = user;
    notifyListeners();
  }
}