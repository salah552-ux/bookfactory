import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PublishGateModal } from "@/components/PublishGateModal";

// vi.mock is hoisted above variable declarations, so mockSend must also be hoisted
const { mockSend } = vi.hoisted(() => ({ mockSend: vi.fn() }));

vi.mock("@/lib/ws", () => ({
  ws: {
    send: mockSend,
    on: vi.fn(() => () => {}),
    onStatus: vi.fn(() => () => {}),
    getStatus: vi.fn(() => "idle" as const),
    start: vi.fn(),
    stop: vi.fn(),
  },
}));

// Capture the registered WS event handler so tests can trigger mock server responses
type WsHandler = (msg: Record<string, unknown>) => void;
let capturedWsHandler: WsHandler | null = null;

vi.mock("@/hooks/useWs", () => ({
  useWsStatus: vi.fn(() => "idle" as const),
  useWsEvent: vi.fn((_type: string, handler: WsHandler) => {
    capturedWsHandler = handler;
  }),
}));

beforeEach(() => {
  mockSend.mockClear();
  capturedWsHandler = null;
});

describe("PublishGateModal — rendering", () => {
  it("does not render when open is false", () => {
    render(
      <PublishGateModal open={false} onClose={vi.fn()} book="my-book" />
    );
    expect(
      screen.queryByText("Confirm KDP publish")
    ).not.toBeInTheDocument();
  });

  it("renders the modal title when open is true", () => {
    render(
      <PublishGateModal open={true} onClose={vi.fn()} book="my-book" />
    );
    expect(screen.getByText("Confirm KDP publish")).toBeInTheDocument();
  });

  it("shows the book name in the warning text", () => {
    render(
      <PublishGateModal open={true} onClose={vi.fn()} book="fix-your-gut" />
    );
    expect(screen.getByText("fix-your-gut")).toBeInTheDocument();
  });
});

describe("PublishGateModal — confirmation gate", () => {
  it("has the confirm button disabled by default", () => {
    render(
      <PublishGateModal open={true} onClose={vi.fn()} book="my-book" />
    );
    const button = screen.getByRole("button", { name: /confirm publish/i });
    expect(button).toBeDisabled();
  });

  it("enables the confirm button when the exact phrase PUBLISH is typed", async () => {
    const user = userEvent.setup();
    render(
      <PublishGateModal open={true} onClose={vi.fn()} book="my-book" />
    );
    await user.type(screen.getByPlaceholderText("Type PUBLISH"), "PUBLISH");
    expect(
      screen.getByRole("button", { name: /confirm publish/i })
    ).not.toBeDisabled();
  });

  it("keeps the confirm button disabled for partial input", async () => {
    const user = userEvent.setup();
    render(
      <PublishGateModal open={true} onClose={vi.fn()} book="my-book" />
    );
    await user.type(screen.getByPlaceholderText("Type PUBLISH"), "PUBLIS");
    expect(
      screen.getByRole("button", { name: /confirm publish/i })
    ).toBeDisabled();
  });

  it("keeps the confirm button disabled for lowercase input", async () => {
    const user = userEvent.setup();
    render(
      <PublishGateModal open={true} onClose={vi.fn()} book="my-book" />
    );
    await user.type(screen.getByPlaceholderText("Type PUBLISH"), "publish");
    expect(
      screen.getByRole("button", { name: /confirm publish/i })
    ).toBeDisabled();
  });
});

describe("PublishGateModal — WebSocket interaction", () => {
  it("sends kdp.publish.confirm with the correct book and phrase when confirmed", async () => {
    const user = userEvent.setup();
    render(
      <PublishGateModal open={true} onClose={vi.fn()} book="my-book" />
    );
    await user.type(screen.getByPlaceholderText("Type PUBLISH"), "PUBLISH");
    await user.click(
      screen.getByRole("button", { name: /confirm publish/i })
    );
    expect(mockSend).toHaveBeenCalledWith({
      type: "kdp.publish.confirm",
      book: "my-book",
      phrase: "PUBLISH",
    });
  });

  it("displays the success message returned from the server", () => {
    render(
      <PublishGateModal open={true} onClose={vi.fn()} book="my-book" />
    );
    act(() => {
      capturedWsHandler?.({
        type: "kdp.publish.result",
        book: "my-book",
        ok: true,
        message: "Publish gate cleared.",
      });
    });
    expect(screen.getByText("Publish gate cleared.")).toBeInTheDocument();
  });

  it("displays the rejection message returned from the server", () => {
    render(
      <PublishGateModal open={true} onClose={vi.fn()} book="my-book" />
    );
    act(() => {
      capturedWsHandler?.({
        type: "kdp.publish.result",
        book: "my-book",
        ok: false,
        message: "Rejected: phrase must be the exact word PUBLISH.",
      });
    });
    expect(
      screen.getByText("Rejected: phrase must be the exact word PUBLISH.")
    ).toBeInTheDocument();
  });

  it("ignores server responses for a different book", () => {
    render(
      <PublishGateModal open={true} onClose={vi.fn()} book="my-book" />
    );
    act(() => {
      capturedWsHandler?.({
        type: "kdp.publish.result",
        book: "other-book",
        ok: true,
        message: "Should not appear",
      });
    });
    expect(screen.queryByText("Should not appear")).not.toBeInTheDocument();
  });
});

describe("PublishGateModal — close", () => {
  it("calls onClose when the Cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(
      <PublishGateModal open={true} onClose={onClose} book="my-book" />
    );
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
