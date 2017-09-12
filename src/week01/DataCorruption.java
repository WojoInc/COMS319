
public class DataCorruption {
  static Counter counter = new Counter();
  static int NO_THREADS = 1000;
	public static void main(String[] args) {
    
		Thread[] threadArray = new Thread[NO_THREADS];
		for (int i = 0; i < NO_THREADS; i++) {
			threadArray[i] = new Thread (new Runnable () {
				  public void run() {
				  	   counter.increment();
				  }
			});
		}

		// Start all the threads
		for (int i = 0; i < NO_THREADS; i++) {
			threadArray[i].start();
		}
		
		// WAIT FOR ALL THREADS TO DIE
		try {
			for (int i = 0; i < NO_THREADS; i++) {
				threadArray[i].join();
			}
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
		System.out.println(counter.value());

	}

}

class Counter {
  private int c = 0;

  public void increment() {
  	    System.out.println("incrementing" + (c++));
  }

  public void decrement() {
      c--;
  }

  public int value() {
      return c;
  }

}
