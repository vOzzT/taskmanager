import 'package:flutter/material.dart';
import 'package:flutter_mobile/components/my_textfield.dart';

final _formKey = GlobalKey<FormState>();

class SignUpFormScreen extends StatefulWidget {
  const SignUpFormScreen({super.key});

  @override
  State<SignUpFormScreen> createState() => SignUpPage();
}

class SignUpPage extends State<SignUpFormScreen> {

  String? validatePhone(String? phone) {
    RegExp phoneRegex = RegExp(r'(^[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-/\s.]?[0-9]{4}$)');
    final isPhoneValid = phoneRegex.hasMatch(phone ?? '');

    if (phone!.isEmpty) {
      return 'Please enter a phone number';
    }
    else if (!isPhoneValid) {
      return 'Please enter valid mobile number';
    }
    return null;
  }

  String? validateEmail(String? email) {
    RegExp emailRegex = RegExp(r'^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$');
    final isEmailValid = emailRegex.hasMatch(email ?? '');

    if (email!.isEmpty) {
      return 'Please enter an email';
    }
    else if (!isEmailValid) {
      return 'Please enter a valid email';
    }
    return null;
  }

  String? validateName(String? name) {

    if (name!.isEmpty) {
      return 'Please enter a name';
    }
    else if (name.length < 3) {
      return 'Name should be at least 3 characters';
    }
    return null;
  }

  String? validateUser(String? user) {

    if (user!.isEmpty) {
      return 'Please enter a username';
    }
    else if (user.length < 4 || user.length > 24) {
      return 'Username must be between 4 to 24 characters';
    }
    else if (!user.startsWith(RegExp(r'[A-Za-z]'), 0)) {
      return 'Username must start with a letter';
    }
    return null;
  }

  String? validatePass(String? pass) {

    RegExp passRegex = RegExp(r'^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[!@#\$&*~]).{8,}$');
    final isPassValid = passRegex.hasMatch(pass ?? '');

    if (pass!.isEmpty) {
      return 'Please enter a password';
    }
    else if (pass.length < 8 || pass.length > 24) {
      return 'Password must be between 8 and 24 characters';
    }
    else if (!isPassValid) {
      return 'Password must include: \nUppercase and lowercase letters\nA number \nA special character';
    }
    return null;
  }


  // text editing controllers
  final firstController = TextEditingController();
  final lastController = TextEditingController();
  final usernameController = TextEditingController();
  final passwordController = TextEditingController();
  final phoneController = TextEditingController();
  final emailController = TextEditingController();

  bool passToggle = true;

  // sign user in method
  void login() {}

  void signUp() {}

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: true,
      backgroundColor: Colors.grey[300],
      body: SingleChildScrollView(

        scrollDirection: Axis.vertical,
        child: Center(
          child: SizedBox (
            width: 360,
            child: Form(
              key: _formKey,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const SizedBox(height: 50),



                  // welcome back, you've been missed!
                  Text(
                    'Please fill in information below',
                    style: TextStyle(
                      color: Colors.grey[700],
                      fontSize: 16,
                    ),
                  ),


                  const SizedBox(height: 35),

                  //First Name
                  MyTextField(controller: firstController, hintText: 'First Name', obscureText: false, validator: validateName),

                  const SizedBox(height: 15),

                  //Last Name
                  MyTextField(controller: lastController, hintText: 'Last Name', obscureText: false, validator: validateName),

                  const SizedBox(height: 15),

                  //Username
                  MyTextField(controller: usernameController, hintText: 'Username', obscureText: false, validator: validateUser),

                  const SizedBox(height: 10),

                  //Password
                  MyTextField(controller: passwordController, hintText: 'Password', obscureText: false, validator: validatePass),

                  const SizedBox(height: 15),

                  //Phone
                  MyTextField(controller: phoneController, hintText: 'Phone', obscureText: false, validator: validatePhone),

                  const SizedBox(height: 15),

                  //Email
                  MyTextField(controller: emailController, hintText: 'Email', obscureText: false, validator: validateEmail),

                  const SizedBox(height: 30),

                  // submit button
                  GestureDetector(
                    onTap: () {
                      _formKey.currentState!.validate();
                    },
                    child: Container(
                      height: 50,
                      margin: const EdgeInsets.symmetric(horizontal: 25),
                      decoration: BoxDecoration(
                        color: Colors.black,
                        borderRadius: BorderRadius.circular(8),
                      ),

                      child: const Center(
                        child: Text(
                          "Submit",
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      ),
                    ),
                  ),


                  const SizedBox(height: 25),

                  // or continue with
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 25.0),
                    child: Row(
                      children: [
                        Expanded(
                          child: Divider(
                            thickness: 0.5,
                            color: Colors.grey[400],
                          ),
                        ),
                        Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 10.0),
                          child: Text(
                            'Registered?',
                            style: TextStyle(color: Colors.grey[700]),
                          ),
                        ),
                        Expanded(
                          child: Divider(
                            thickness: 0.5,
                            color: Colors.grey[400],
                          ),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 25),

                  // back to login button
                  GestureDetector(
                    onTap: () {
                      Navigator.pushNamed(context, '/login');
                    },
                    child: Container(
                      height: 50,
                      margin: const EdgeInsets.symmetric(horizontal: 25),
                      decoration: BoxDecoration(
                        color: Colors.black,
                        borderRadius: BorderRadius.circular(8),
                      ),

                      child: const Center(
                        child: Text(
                          "Login",
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      ),
                    ),
                  ),

                  const SizedBox(height: 50),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
