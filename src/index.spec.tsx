import React, { cloneElement } from "react";
import renderer from "react-test-renderer";
import useHover, { UseHoverOptions } from "./index";

type Hook = ReturnType<typeof useHover>;

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface TestComponentProps {
  hookOptions?: UseHoverOptions;
  onRender: (hookReturn: ReturnType<typeof useHover>) => null;
}

function TestComponent(props: TestComponentProps) {
  const hookReturn = useHover(props.hookOptions);
  return props.onRender(hookReturn);
}

function createTestWrapper(options?: UseHoverOptions) {
  let hook: Hook | undefined;

  const render = {
    observers: new Set<Function>(),
    dispatch: () =>
      render.observers.forEach(fn => {
        fn();
        render.observers.delete(fn);
      }),
    subscribe: (fn: Function) => render.observers.add(fn)
  };

  const element = (
    <TestComponent
      hookOptions={options}
      onRender={hookReturn => {
        hook = hookReturn;
        render.dispatch();
        return null;
      }}
    />
  );

  const component = renderer.create(element);
  const assert = async (assertion: (hook: Hook) => void) => {
    return new Promise(resolve => {
      render.subscribe(() => {
        assertion(hook!);
        resolve();
      });
      // Ensure new render actually happens
      component.update(cloneElement(element, { _: Date.now() }));
    });
  };
  const flush = () => new Promise(render.subscribe);
  const mouseEnter = () => hook![1].onMouseEnter!({} as any);
  const mouseLeave = () => hook![1].onMouseLeave!({} as any);

  return {
    initialIsHovering: hook![0],
    mouseEnter,
    mouseLeave,
    component,
    assert,
    flush
  };
}

test("isHovering is initially false", async () => {
  const { initialIsHovering } = createTestWrapper();
  expect(initialIsHovering).toBe(false);
});

test("isHovering turns true after mouse enter", async () => {
  const { mouseEnter, assert } = createTestWrapper({
    mouseEnterDelayMS: 0
  });
  mouseEnter();
  await wait(0);
  await assert(hook => expect(hook[0]).toBe(true));
});

test("isHovering turns false after mouse leave", async () => {
  const { mouseEnter, mouseLeave, assert, flush } = createTestWrapper({
    mouseEnterDelayMS: 0
  });
  mouseEnter();
  await flush();
  mouseLeave();
  await flush();
  await assert(hook => expect(hook[0]).toBe(false));
});

test("mouseEnterDelayMS delays isHovering turning true", async () => {
  const { mouseEnter, assert } = createTestWrapper({
    mouseEnterDelayMS: 100
  });

  mouseEnter();
  await assert(hook => expect(hook[0]).toBe(false));
  await wait(100);
  await assert(hook => expect(hook[0]).toBe(true));
});

test("mousing out cancels delayed mouse enter", async () => {
  const { mouseEnter, mouseLeave, assert } = createTestWrapper({
    mouseEnterDelayMS: 100
  });
  mouseEnter();
  mouseLeave();
  await assert(hook => expect(hook[0]).toBe(false));
  await wait(300);
  await assert(hook => expect(hook[0]).toBe(false));
});

test("mouseLeaveDelayMS delays isHovering turning false", async () => {
  const { mouseEnter, mouseLeave, assert, flush } = createTestWrapper({
    mouseLeaveDelayMS: 100
  });
  jest.useRealTimers();
  mouseEnter();
  await flush();
  mouseLeave();
  await wait(0);
  await assert(hook => expect(hook[0]).toBe(true));
  await wait(100);
  await assert(hook => expect(hook[0]).toBe(false));
});

test("mousing in cancels delayed mouse leave", async () => {
  const { mouseEnter, mouseLeave, assert, flush } = createTestWrapper({
    mouseEnterDelayMS: 0,
    mouseLeaveDelayMS: 100
  });
  mouseEnter();
  await flush();
  mouseLeave();
  await wait(0);
  await assert(hook => expect(hook[0]).toBe(true));
  await wait(100);
  await assert(hook => expect(hook[0]).toBe(false));
});
