import 'package:flutter/material.dart';

class HomeFormScreen extends StatefulWidget {
  const HomeFormScreen({super.key});

  @override
  State<HomeFormScreen> createState() => HomePage();
}


class HomePage extends State<HomeFormScreen> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      resizeToAvoidBottomInset: false,
      backgroundColor: Colors.grey[300],

      
      body: Container(

          decoration: const BoxDecoration(
            image: DecorationImage(
            image: AssetImage("assets/notebook.png"),
            fit: BoxFit.cover,
            )
          ),

          
          child: Container(
            width: 360,
            color: Colors.white,

              child: Column(
                
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const SizedBox(height: 50),

                  const Text(
                    'COMPOSITION CALENDAR',
                    style: TextStyle(fontSize: 36, fontWeight: FontWeight.bold,),
                  ),

                  const SizedBox(height: 50),

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
                      ],
                    ),
                  ),
                  // welcome back, you've been missed!
                  Text(
                    'Welcome back, you\'ve been missed!',
                    style: TextStyle(
                      color: Colors.grey[700],
                      fontSize: 16,
                    ),
                  ),

                  const SizedBox(height: 50),

                  // sign up button
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
                          "Continue",
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
      
    );
  }
}