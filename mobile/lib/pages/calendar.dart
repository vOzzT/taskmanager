import 'package:flutter/material.dart';
import 'package:poosd/providers/user_provider.dart';
import 'package:provider/provider.dart';


final _formKey = GlobalKey<FormState>();

class CalendarFormScreen extends StatefulWidget {
  const CalendarFormScreen({super.key});

  @override
  State<CalendarFormScreen> createState() => CalendarPage();
}

class CalendarPage extends State<CalendarFormScreen> {


  @override
  Widget build(BuildContext context) {

    final user = Provider.of<UserProvider>(context).user;
    
    return Scaffold(
      body: Stack(
        children: [

        new Container(
          width: double.infinity,
          height: double.infinity,
          decoration: const BoxDecoration(
            image: DecorationImage(
              image: AssetImage("assets/notebook.png"),
              fit: BoxFit.cover,
            ),
          ),
        ),

          SingleChildScrollView(
            child: Form( 
              child: Center(

                
                child: ElevatedButton(
                  child: const Text('BottomSheet Button'),
                  onPressed: () {
                    showModalBottomSheet(
                      context: context, 
                      builder: (BuildContext context) {
                        return SizedBox(
                          height: 600,
                          child: Center(
                            child: ElevatedButton(
                              child: const Text('Close'),
                              onPressed: () {
                                Navigator.pop(context);
                              },
                            ),
                          ),
                        );
                      }
                    );
                  },
                ),



              ),
            ),
          ),

        ],

      ),
    );
  }
}