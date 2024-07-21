import 'dart:convert';

class User {
  final String login;
  final String password;
  final String firstname;
  final String lastname;
  final String email;
  final String phone;
  late String userEyeD;
  late String token;

  User({
    required this.login,
    required this.password,
    required this.firstname,
    required this.lastname,
    required this.email,
    required this.phone,
  });

  
  Map<String, dynamic> toMap() {
    return {
      'login': login,
      'password': password,
      'firstname': firstname,
      'lastname': lastname,
      'phone': phone,
      'email': email,
    };
  }

  factory User.fromMap(Map<String, dynamic> map) {
    return User(
      login: map['login'] ?? '',
      password: map['password'] ?? '',
      firstname: map['firstname'] ?? '',
      lastname: map['lastname'] ?? '',
      email: map['email'] ?? '',
      phone: map['phone'] ?? '',
    );
  }

  String getId() {
    return userEyeD;
  }

  void setId(String s) {
    userEyeD = s;
  }

  String getToken() {
    return token;
  }

  void setToken(String s) {
    token = s;
  }

  String toJson() => json.encode(toMap());

  factory User.fromJson(String source) => User.fromMap(json.decode(source));
}