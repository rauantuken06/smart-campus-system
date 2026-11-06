import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import RoomGrid from '../components/RoomGrid';
import RoomFilters from '../components/RoomFilters';
import { SAMPLE_ROOMS } from '../data';

describe('RoomGrid (F4 empty state)', () => {
  it('shows an empty-state message when no rooms match', () => {
    const html = renderToStaticMarkup(
      <RoomGrid rooms={[]} selectedRoomId={null} onSelect={() => {}} />
    );
    expect(html).toContain('No rooms match these filters');
  });

  it('renders one card per matching room and no empty-state message', () => {
    const html = renderToStaticMarkup(
      <RoomGrid rooms={SAMPLE_ROOMS.slice(0, 2)} selectedRoomId="r1" onSelect={() => {}} />
    );
    expect(html).not.toContain('No rooms match these filters');
    expect(html).toContain(SAMPLE_ROOMS[0].name);
    expect(html).toContain(SAMPLE_ROOMS[1].name);
  });

  it('shows the blocked badge for blocked rooms', () => {
    const html = renderToStaticMarkup(
      <RoomGrid rooms={SAMPLE_ROOMS} selectedRoomId={null} onSelect={() => {}} />
    );
    expect(html).toContain('Blocked');
  });
});

describe('RoomFilters', () => {
  const baseProps = {
    minCapacity: 0,
    equipmentOptions: ['Microphone', 'Projector'],
    selectedEquipment: [] as string[],
    onMinCapacityChange: () => {},
    onToggleEquipment: () => {},
    onClear: () => {},
  };

  it('marks selected equipment as pressed', () => {
    const html = renderToStaticMarkup(
      <RoomFilters {...baseProps} selectedEquipment={['Projector']} />
    );
    expect(html).toMatch(/aria-pressed="true"[^>]*>Projector</);
    expect(html).toMatch(/aria-pressed="false"[^>]*>Microphone</);
  });

  it('shows the clear action only when a filter is active', () => {
    expect(renderToStaticMarkup(<RoomFilters {...baseProps} />)).not.toContain('Clear filters');
    expect(
      renderToStaticMarkup(<RoomFilters {...baseProps} minCapacity={30} />)
    ).toContain('Clear filters');
  });
});
