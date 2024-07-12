import 'package:flutter/material.dart';
import 'package:poosd/pages/login.dart';
import 'package:poosd/pages/signup.dart';
import 'package:poosd/pages/calendar.dart';
import 'package:poosd/providers/user_provider.dart';

import 'package:provider/provider.dart';

void main() {
  runApp( 
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => UserProvider()),
      ],
      child: const MyApp(),
    )
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: const LoginFormScreen(),
      routes: {
        '/signup': (context) => const SignUpFormScreen(),
        '/login': (context) => const LoginFormScreen(),
        '/calendar': (context) => const CalendarFormScreen()
      },
    );
  }
}
