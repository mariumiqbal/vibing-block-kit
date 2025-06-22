import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@vitest/expect';
import { PromptContainerFullLineBottomActionsBlock } from '../blocks/prompt/PromptContainerFullLineBottomActionsBlock';

describe('PromptContainerFullLineBottomActionsBlock', () => {
  let handleSubmit: ReturnType<typeof vi.fn>;
  let handleChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    handleSubmit = vi.fn();
    handleChange = vi.fn();
  });

  it('should render text area with placeholder text', () => {
    render(
      <PromptContainerFullLineBottomActionsBlock
        id="test-prompt"
        value=""
        onChange={handleChange}
        onSubmit={handleSubmit}
        placeholder="Test placeholder"
      />
    );

    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should change text on change event/typing', async () => {
    render(
      <PromptContainerFullLineBottomActionsBlock
        id="test-prompt"
        value=""
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New text' } });
    expect(handleChange).toHaveBeenCalledWith('New text');
  });

  it('should submit on keyDown', async () => {
    render(
      <PromptContainerFullLineBottomActionsBlock
        id="test-prompt"
        value="Hello"
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    );

    const textarea = screen.getByRole('textbox');
    fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });
    expect(handleSubmit).toHaveBeenCalledWith('Hello');
  });

  it('shold submit on metaKey + Enter', () => {
    render(
      <PromptContainerFullLineBottomActionsBlock
        id="test-prompt"
        value="Hello"
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    );
    const textarea = screen.getByRole('textbox');
    fireEvent.keyDown(textarea, { key: 'Enter', metaKey: true });
    expect(handleSubmit).to;
  });

  it('should submit on button click', () => {
    render(
      <PromptContainerFullLineBottomActionsBlock
        id="test-prompt"
        value="Hello"
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    );
    const button = screen.getByRole('button', { name: 'Send message' });
    fireEvent.click(button);
    expect(handleSubmit).toHaveBeenCalledWith('Hello');
  });

  it('should not submit if text area is disabled', () => {
    render(
      <PromptContainerFullLineBottomActionsBlock
        id="test-prompt-disabled"
        value=""
        onChange={() => {}}
        onSubmit={handleSubmit}
        disabled
      />
    );
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Send message' })).toBeDisabled();
  });

  it('auto resizes text area based on content', () => {
    render(
      <PromptContainerFullLineBottomActionsBlock
        id="test-prompt-resize"
        value="Short text"
        onChange={handleChange}
        onSubmit={handleSubmit}
      />
    );

    const textarea = screen.getByRole('textbox') as HTMLTextAreaElement;
    Object.defineProperty(textarea, 'scrollHeight', {
      get: () => 150, // Simulate a scroll height of 150px
    });

    fireEvent.change(textarea, {
      target: { value: 'This is a longer text for auto resizing'.repeat(100) },
    });
    expect(textarea.style.height).not.toBe(150);
  });

  it('should render action buttons if provided', () => {
    const actionButton1 = vi.fn();
    const actionButton2 = vi.fn();

    const customAction = (
      <>
        <button arial-label="Action 1" onClick={actionButton1}>
          Action 1
        </button>
        <button arial-label="Action 2" onClick={actionButton2}>
          Action 2
        </button>
      </>
    );

    render(
      <PromptContainerFullLineBottomActionsBlock
        id="test-prompt-actions"
        value=""
        onChange={handleChange}
        onSubmit={handleSubmit}
        actionButtons={customAction}
      />
    );

    const button1 = screen.getByRole('button', { name: 'Action 1' });
    const button2 = screen.getByRole('button', { name: 'Action 2' });

    expect(button1).toBeInTheDocument();
    expect(button2).toBeInTheDocument();

    fireEvent.click(button1);
    expect(actionButton1).toHaveBeenCalled();

    fireEvent.click(button2);
    expect(actionButton2).toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'Send message' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Use Microphone' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Attach file' })).not.toBeInTheDocument();
  });
});
