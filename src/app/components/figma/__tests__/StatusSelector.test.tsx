import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StatusSelector } from '../StatusSelector'

describe('StatusSelector', () => {
  it('should render 3 buttons', () => {
    render(<StatusSelector currentStatus="not-started" onSelect={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(3)
  })

  it('should display all 3 status labels', () => {
    render(<StatusSelector currentStatus="not-started" onSelect={vi.fn()} />)
    expect(screen.getByText('Not Started')).toBeInTheDocument()
    expect(screen.getByText('In Progress')).toBeInTheDocument()
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('should highlight the current status with bg-accent', () => {
    render(<StatusSelector currentStatus="in-progress" onSelect={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    const inProgressButton = buttons.find(b => b.textContent?.includes('In Progress'))
    expect(inProgressButton?.className).toContain('bg-accent')
  })

  it('should call onSelect with the correct status when clicked', async () => {
    const user = userEvent.setup()
    const handleSelect = vi.fn()
    render(<StatusSelector currentStatus="not-started" onSelect={handleSelect} />)

    await user.click(screen.getByText('Completed'))
    expect(handleSelect).toHaveBeenCalledWith('completed')

    await user.click(screen.getByText('In Progress'))
    expect(handleSelect).toHaveBeenCalledWith('in-progress')
  })

  it('should have data-testid="status-selector" on the container', () => {
    render(<StatusSelector currentStatus="not-started" onSelect={vi.fn()} />)
    expect(screen.getByTestId('status-selector')).toBeInTheDocument()
  })

  it('should use py-3 for 44px touch targets', () => {
    render(<StatusSelector currentStatus="not-started" onSelect={vi.fn()} />)
    const buttons = screen.getAllByRole('button')
    for (const button of buttons) {
      expect(button.className).toContain('py-3')
    }
  })

  it('should use text-blue-600 for in-progress option', () => {
    render(<StatusSelector currentStatus="not-started" onSelect={vi.fn()} />)
    const container = screen.getByTestId('status-selector')
    const inProgressButton = screen.getByText('In Progress').closest('button')
    const iconSpan = inProgressButton?.querySelector('span.text-blue-600')
    expect(iconSpan).toBeTruthy()
  })

  it('should use text-green-600 for completed option', () => {
    render(<StatusSelector currentStatus="not-started" onSelect={vi.fn()} />)
    const completedButton = screen.getByText('Completed').closest('button')
    const iconSpan = completedButton?.querySelector('span.text-green-600')
    expect(iconSpan).toBeTruthy()
  })
})
