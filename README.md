# SERVICES AND DEPENDENCY INJECTION

\*Important: The Angular injector for services is Heirarchical - it not only provides the service for the component it
is passed into, but for all that component's child components.

Ex: If you provide a service in the App Module, the SAME INSTANCE of that service is available throughout the
entire application.
NOTE: Instances of the service do not propogate up, they only go down to the children (so if you provide the service
to a child component whose parent already has it provided, that instance will propogate down to it's children and not
the one from the parent component)

    GOTCHA: If you provide a service on a component that has no children (at the bottom of a heirarchy), and the SAME
    service is provided to a parent component of it, then the instance provided in the bottom level component will
    overwrite the downwards propagated instance of that service from a parent.  This can lead to overwriting data from
    a service in a parent that you want passed down.

    Solution: remove the service from the providers array in the child component to retain the same instance of the service
              from the parent.

## CREATING A SERVICE:

- Place general services in the app folder, or more specific services in a shared/ folder

- Name service files with a .service.ts extension. Ex: `logging.service.ts`

- A service is a normal TypeScript class and does not need a decorator.

- You do not manually create instances of service classes you create, you use Angular's dependency injector to do that
  in your component so you have access to the service helper methods.

1. Create a class named after the service and export it:
   Ex: `export class LoggingService {}`

2. Create helper methods in the class that will be used with the service

Ex:

```
export class LoggingService {
  logStatusChange(status: string) {
    console.log("A server status changed: " + status);
  }
}
```

3. Add the service to a component:

   1. add constructor and inject the service into it
   2. add providers to decorator config and pass in the service class

   -Add a constructor to the component class which assigns a property to the service class.

   - the type of the argument must be the service class you created.

- Angular will see that the component requires the class type as an argument and will instantiate it for you
  when constructing the component, and then assign it to the property because of the private accessor

- Finally add a providers property to the @Component config object, and set it to an array containing the types of
  the services (their classes)

Ex in the class component ts file:

```
 ..imports
 import { LoggingService } from "../logging.service";

 @Component({
     ...,
     providers:[LoggingService]
 })
 export class NewAccountComponent {
   @Output() accountAdded = new EventEmitter<{ name: string; status: string }>();

   constructor(private loggingService: LoggingService) {}


   onCreateAccount(accountName: string, accountStatus: string) {
     ...
     // use the service:
     this.loggingService.logStatusChange(accountStatus);
   }
```

### INJECTING A SERVICE INTO ANOTHER SERVICE

- You can have services use other services (i.e. one service uses a logging service to log something whenever
  one of it's methods is called)

1.  You cannot do this at the component level, you need to add the service to inject to another in the app.module.ts
    providers.

    Ex in app.module.ts:

    ```
    @NgModule({
       declarations: [AppComponent, AccountComponent, NewAccountComponent],
       imports: [BrowserModule, FormsModule],
       providers: [AccountsService, LoggingService],
       bootstrap: [AppComponent]
     })
    ```


    2) Inject the service into the other service's contructor and use the service:

    Ex:
    ```
    export class AccountsService {
      ...

      constructor(private loggingService: LoggingService) {}

      addAccount(name: string, status: string) {
        this.accounts.push({ name, status });
        this.loggingService.logStatusChange(status);
      }
      ...
    }
    ```
    3) Set up meta data for the service consuming the other injected service.
       - Angular needs some meta data (i.e. provided on the @Component decorator) to inject the service into another
       - Use @Injectable() decorator on the service you want to inject another into.

       Ex:

          ```
          import { Injectable } from '@angular/core'

          @Injectable()
          export class AccountsService {
            ...

            constructor(private loggingService: LoggingService) {}
            ...
          }
    ```

### NOTE:

If you're using Angular 6+ (check your package.json to find out), you can provide application-wide services in a
different way.

Instead of adding a service class to the providers[] array in AppModule , you can set the following config in @Injectable() :

```
@Injectable({providedIn: 'root'})
export class MyService { ... }
This is exactly the same as:

export class MyService { ... }
and

import { MyService } from './path/to/my.service';

@NgModule({
    ...
    providers: [MyService]
})
export class AppModule { ... }
```

Using this new syntax is completely optional, the traditional syntax (using providers[] ) will still work. The
"new syntax" does offer one advantage though: Services can be loaded lazily by Angular (behind the scenes) and
redundant code can be removed automatically. This can lead to a better performance and loading speed - though
this really only kicks in for bigger services and apps in general.
