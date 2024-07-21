import 'package:flutter/material.dart';
import 'package:poosd/models/event.dart';
import 'package:poosd/components/event_data_source.dart';
import 'package:poosd/components/task_widget.dart';
import 'package:poosd/providers/event_provider.dart';
import 'package:poosd/services/event_services.dart';
import 'package:poosd/utils/utils.dart';
//import 'package:poosd/providers/user_provider.dart';
import 'package:provider/provider.dart';
import 'package:syncfusion_flutter_calendar/calendar.dart';


class CalendarFormScreen extends StatefulWidget {
  const CalendarFormScreen({super.key});

  @override
  State<CalendarFormScreen> createState() => CalendarPage();
}

class CalendarPage extends State<CalendarFormScreen> {

  final EventServices eventService = EventServices();

  DateTime yesterday = DateTime.now().subtract(const Duration(days:1));
  DateTime tomorrow = DateTime.now().add(const Duration(days:1));
  DateTime today = DateTime.now();
  DateTime endOfWeek = DateTime.now().add(Duration(days: DateTime.daysPerWeek - DateTime.now().weekday));

  @override
  Widget build(BuildContext context) {

    //final user = Provider.of<UserProvider>(context).user;
    final events = Provider.of<EventProvider>(context).events;
    
    return Scaffold(

      appBar: AppBar(
        //title: Text("Welcome, ${user.firstname}"),
        title: const Text("Composition Calendar"),
        actions: logout(),
        ),
      
      body: PageView(
        children: [

          
          Scaffold(

            body: Stack(
                alignment: Alignment.topCenter,
                children: [
                  Container(
                    decoration: const BoxDecoration(
                      image: DecorationImage(
                        image: AssetImage("assets/notebook.png"),
                        fit: BoxFit.cover,
                      )
                    ),
                  ),

                  Padding(
                    padding: const EdgeInsets.all(25),
                    child: Container(
                      
                      
                      color: Colors.white,

                      child: Column(
                        children: [
                          const Text(
                            "Daily Tasks",
                            style: TextStyle(fontSize: 36, color: Colors.black),
                            textAlign: TextAlign.center,
                          ),

                          const Divider(
                            color: Colors.black,
                            thickness: 2,
                          ),

                          displayDay(events),
                        ],
                      ),
                    ),
                  ),
                  
                ]
              ),
          ),
          
          Scaffold(

            body: Stack(
                alignment: Alignment.topCenter,
                children: [
                  Container(
                    decoration: const BoxDecoration(
                      image: DecorationImage(
                        image: AssetImage("assets/notebook.png"),
                        fit: BoxFit.cover,
                      )
                    ),
                  ),

                  Padding(
                    padding: const EdgeInsets.all(25),
                    child: Container(
                      
                      color: Colors.white,

                      child: Column(
                        children: [
                          const Text(
                            "Weekly Tasks",
                            style: TextStyle(fontSize: 36, color: Colors.black),
                            textAlign: TextAlign.center,
                          ),

                          const Divider(
                            color: Colors.black,
                            thickness: 2,
                          ),

                          displayWeek(events),
                        ],
                      ),
                    ),
                  ),
                  
                ]
              ),
          ),

          Scaffold(
            // appBar: AppBar(
            //   actions: loadEvents(),
            // ),
            body: SfCalendar(
              view: CalendarView.month,
              initialSelectedDate: DateTime.now(),
              todayHighlightColor: Colors.redAccent,

              dataSource: EventDataSource(events),
              onLongPress: (details) {

                final provider = Provider.of<EventProvider>(context, listen: false);
                provider.setDate(details.date!);

                showModalBottomSheet(
                  context: context, 
                  builder: (context) => TasksWidget(),
                );
              },
            ),


            floatingActionButton: FloatingActionButton(
              backgroundColor: Colors.blue,
              onPressed: () {
                      Navigator.pushNamed(context, '/event');
                    },
              child: const Icon(
                Icons.add, color: Colors.white
              ),
            ),

            
          ),

          
        ],
      ),
    );
  }


  Widget builDayOrWeek(List<Event> events) => Row(
    mainAxisAlignment: MainAxisAlignment.center,
    crossAxisAlignment: CrossAxisAlignment.center,

    children: [
      GestureDetector(
        onTap: () => displayDay(events),
        child: Container(
          padding: const EdgeInsets.all(25),
          margin: const EdgeInsets.symmetric(horizontal: 25),
          decoration: BoxDecoration(
            color: Colors.black,
            borderRadius: BorderRadius.circular(8),
          ),

          child: const Center(
            child: Text(
              "Day",
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
          ),
        ),
      ),

      GestureDetector(
        onTap: () {
          displayWeek(events);
        },
        child: Container(
          padding: const EdgeInsets.all(25),
          margin: const EdgeInsets.symmetric(horizontal: 25),
          decoration: BoxDecoration(
            color: Colors.black,
            borderRadius: BorderRadius.circular(8),
          ),

          child: const Center(
            child: Text(
              "Week",
              style: TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
          ),
        ),
      ),
    ],
  );

  Widget displayDay(List<Event> events) => Expanded(
        child: ListView(
          children: events.map((ev) {
            
          if (events.isEmpty) {
            return const Card(
              child: Row(
                children: [
                  Text(
                   'To see more tasks, click add in the calendar',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            );
          }

          if (ev.from.isBefore(tomorrow) && ev.to.isAfter(yesterday)) {
            return Card(
              child: Row(
                children: [
                  Text(
                    ev.title,
                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)
                    ),

                  const Spacer(),

                  Text(
                    'due at ${Utils.toHour(ev.to)}',
                    style: const TextStyle(fontStyle: FontStyle.italic)
                  )
                ],
              ),
            );
          } 

        return const SizedBox(height: 0);
      }).toList(),
    ),
  );

  Widget displayWeek(List<Event> events) => Expanded(
        child: ListView(
          children: events.map((ev) {
            
          if (events.isEmpty) {
            return const Card(
              child: Row(
                children: [
                  Text(
                   'To see more tasks, click add in the calendar',
                    style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            );
          }

          if (ev.from.isBefore(endOfWeek) && ev.to.isAfter(yesterday)) {
            return Card(
              child: Row(
                children: [
                  Text(
                    ev.title,
                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold)
                    ),

                  const Spacer(),

                  Text(
                    'due ${Utils.toWeekDay(ev.to)}',
                    style: const TextStyle(fontStyle: FontStyle.italic)
                    )
                ],
              ),
            );
          }

        return const SizedBox(height: 0);
      }).toList(),
    ),
  );

  List<Widget> logout() => [
    ElevatedButton.icon(
      onPressed: () {
        Navigator.pushNamed(context, '/home');
      },

      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.transparent,
        shadowColor: Colors.transparent,
        iconColor: Colors.red,
      ),
      icon: const Icon(Icons.logout),
      label: const Text(
        'Logout',
        style: TextStyle(color: Colors.red),
      ),
      
    ),
  ];

  
}