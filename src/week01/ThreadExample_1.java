// GOALS 
// 1. Create Thread by Extending Thread
// 2. getName() gets name of thread
// 3. start() moves the thread to the ready queue 

public class ThreadExample_1 {
  static final int NO_THREADS = 10;
	public static void main(String[] args) {
	
		// create 100 threads array
		Thread[] threadArray = new Thread[NO_THREADS];
		for (int i = 0; i < NO_THREADS; i++) {
			threadArray[i] = new MyThread("MyThread-");
		}
		System.out.println();

		// Start all the threads
		for (int i = 0; i < NO_THREADS; i++) {
			threadArray[i].start();
		}
		
		
		
		System.out.println("The king is dead!");

	}

}

class MyThread extends Thread {
	static int threadCount = 0;
	int myCount;

	public MyThread(String name) {
		super(name + threadCount);
		myCount = threadCount;
		threadCount++;
	}

	public void run() {
		System.out.println(this.getName() + " has started working");
		// fake random ampunt of work by random sleeping instead
		try {
			sleep((int) (Math.random() * 2000)); // Thread.sleep
		} catch (InterruptedException e) {
			e.printStackTrace();
		}

		System.out.println(this.getName() + " is done");
	}
}
