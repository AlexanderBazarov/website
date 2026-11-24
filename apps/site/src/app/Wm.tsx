import { useEffect, useMemo, useState } from "react";
import { useMediaQuery } from "./useMediaQuery";
import { AppWindow } from "./AppWindow";
import styled from "styled-components";
import { Binding, useKeymap, useRouter } from "@mystyte/core";
import { v4 as uuid } from 'uuid';

type Dir = "vertical" | "horizontal";
type LayoutNode =
  | { type: "win"; id: string }
  | { type: "split"; dir: Dir; a: LayoutNode; b: LayoutNode };

interface WinState {
  id: string;
  path: string;
  cursorId: string;
}

interface SplitState {
  first: string;
  second: string;
}

const Split = styled.div<{ $dir: Dir }>`
  display: flex;
  flex-direction: ${(p) => (p.$dir === "vertical" ? "row" : "column")};
  gap: 8px;
  height: 100%;
  width: 100%;
  min-width: 0;
  min-height: 0;
  > * { flex: 1 1 0; min-width: 0; min-height: 0; }
`;

export const MOBILE_QUERY = "(max-width: 760px)";

export interface WMProps {
  onHelp: () => void;
  cursorId: string;
  commandLine?: React.ReactNode;
  right?: React.ReactNode;
}

export function WM({ onHelp, cursorId, commandLine: cmdLine, right }: WMProps) {
    const { path } = useRouter();

    useKeymap([
      { keys: 'cmd+shift+d', run: () => splitWindow("horizontal") },
      { keys: 'cmd+d', run: () => splitWindow('vertical') },
      { keys: 'cmd+q', run: () => removeWindow() }
    ]);

    const [layout, setLayout] = useState<LayoutNode>({
      type: "split", dir: "horizontal",
      a: { type: "win", id: "w1" },
      b: { type: "split", dir: "vertical", a: { type: "win", id: "w2" }, b: { type: "win", id: "w3" } },
    });

    const [windows, setWindows] = useState<WinState[]>([
        { id: 'w1', path: 'home', cursorId: 'c1' }, 
        { id: 'w2', path: 'about.md', cursorId: 'c2' },
        { id: 'w3', path: 'contacts', cursorId: 'c3' }
    ]);
    const [activeId, setActiveId] = useState('w1');
    const mobile = useMediaQuery(MOBILE_QUERY);

    useEffect(() => {
        const window = windows.find((win) => win.id === activeId);
        if (window && window.path !== path) {
            setWindows((prev) =>
                prev.map((win) => (win.id === activeId ? { ...win, path } : win))
            );
        }
    }, [path]);

      useEffect(() => {
        const window = windows.find((win) => win.id === activeId);
        if (window && window.cursorId !== cursorId) {
            setWindows((prev) =>
                prev.map((win) => (win.id === activeId ? { ...win, cursorId } : win))
            );
        }
    }, [cursorId]);

    const splitWindow = (dir: Dir) => {
      const source = windows.find((win) => win.id === activeId);
      if (!source) return;
      
      const newId = uuid();
      setWindows((prev) => [...prev, { ...source, id: newId }]);
      setLayout((prev) =>
        replaceNode(prev, activeId, {
          type: "split",
          dir,
          a: { type: "win", id: activeId },
          b: { type: "win", id: newId },
        }),
      );
      setActiveId(newId);
    };

    const removeWindow = () => {
      const found = findNode(layout, activeId);
      if (!found?.parent) return;

      const sibling = found.side === "a" ? found.parent.b : found.parent.a;

      setLayout((prev) => removeNode(prev, activeId) ?? prev);
      setWindows((prev) => prev.filter((win) => win.id !== activeId));
      setActiveId(firstLeaf(sibling));
    };

    const renderWindow = (id: string) => {
      const win = windows.find((w) => w.id === id);
      if (!win) return null;
      return (
        <AppWindow
          key={win.id}
          path={win.path}
          onHelp={onHelp}
          onFocus={() => setActiveId(win.id)}
          cursorId={win.cursorId}
          cmdline={win.id === activeId ? cmdLine : null}
          isActive={win.id === activeId}
          right={win.id === activeId ? right : null}
        />
      );
    };

    const renderNode = (node: LayoutNode): React.ReactNode =>
      node.type === "win" ? renderWindow(node.id) : (
        <Split $dir={node.dir}>
          {renderNode(node.a)}
          {renderNode(node.b)}
        </Split>
      );

  return mobile ? renderWindow(activeId) : renderNode(layout);
}

type SplitNode = Extract<LayoutNode, { type: "split" }>;

interface Found {
  node: LayoutNode;
  parent: SplitNode | null;
  side: "a" | "b" | null;
}

function findNode(
  node: LayoutNode,
  id: string,
  parent: SplitNode | null = null,
  side: "a" | "b" | null = null,
): Found | undefined {
  if (node.type === "win") return node.id === id ? { node, parent, side } : undefined;
  return findNode(node.a, id, node, "a") ?? findNode(node.b, id, node, "b");
}

function replaceNode(node: LayoutNode, id: string, next: LayoutNode): LayoutNode {
  if (node.type === "win") return node.id === id ? next : node;
  const a = replaceNode(node.a, id, next);
  const b = replaceNode(node.b, id, next);
  return a === node.a && b === node.b ? node : { ...node, a, b };
}

function removeNode(root: LayoutNode, id: string): LayoutNode {
  const found = findNode(root, id);
  if (!found) return root;
  if (!found.parent) return root;
  const sibling = found.side === "a" ? found.parent.b : found.parent.a;
  return replaceRef(root, found.parent, sibling);
}

function replaceRef(node: LayoutNode, target: LayoutNode, next: LayoutNode): LayoutNode {
  if (node === target) return next;
  if (node.type === "win") return node;
  const a = replaceRef(node.a, target, next);
  const b = replaceRef(node.b, target, next);
  return a === node.a && b === node.b ? node : { ...node, a, b };
}

function firstLeaf(node: LayoutNode): string {
  return node.type === "win" ? node.id : firstLeaf(node.a);
}
