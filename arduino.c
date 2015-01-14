
const int bt1o = 2;
const int bt1d = 3;
const int bt2o = 4;
const int bt2d = 5;

int t1o = 0; 
int t1d = 0;
int t2o = 0;
int t2d = 0;

int buttonPressed = 0;

void setup() {
  // Team 1 offense
  pinMode(bt1o, INPUT);    
 
  // Team 1 defense
  pinMode(bt1d, INPUT); 
  
  // Team 2 offense
  pinMode(bt2o, INPUT); 
 
  // Team 2 defense
  pinMode(bt2d, INPUT); 
  
  Keyboard.begin();
}

void loop(){
  
  t1o = digitalRead(bt1o);
  t1d = digitalRead(bt1d);
  t2o = digitalRead(bt2o);
  t2d = digitalRead(bt2d);

  
  
  if(t1o == HIGH){
    Keyboard.write('q');
    delay(1000);
  }
  
  if(t1d == HIGH){
    Keyboard.write('a');
    delay(1000);
  }
  
  if(t2o == HIGH){
    Keyboard.write('w');
    delay(1000);
  }
  
  if(t2d == HIGH){
    Keyboard.write('s');
    delay(1000);
  }

}