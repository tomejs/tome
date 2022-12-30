
export default function events () {
  const $events: { [key: string]: ((data: any) => void)[] } = {};

  return {
    $$sub(eventName: string, fn: (data: any) => void) {
      if(!$events[eventName]) {
        $events[eventName] = [];
      }

      $events[eventName].push(fn);
    },

    $$pub(eventName: string, data?: any) {
      $events[eventName] && $events[eventName].forEach(fn => fn(data));
    }
  }
}
