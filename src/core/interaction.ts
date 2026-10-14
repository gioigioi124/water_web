/**
 * Dual Pointer Events Interaction Controller
 * Handles drag-and-tilt fluid pouring AND tap-to-pour fallback
 */

export interface InteractionHandlers {
  onPour: (fromId: string, toId: string) => void;
  onFill?: (vesselId: string) => void;
  onEmpty?: (vesselId: string) => void;
  onSelect?: (vesselId: string | null) => void;
}

export class VesselInteractionManager {
  private container: HTMLElement;
  private handlers: InteractionHandlers;
  private selectedVesselId: string | null = null;

  // Drag tracking state
  private activePointerId: number | null = null;
  private draggedElement: HTMLElement | null = null;
  private draggedVesselId: string | null = null;
  private startX = 0;
  private startY = 0;
  private currentX = 0;
  private currentY = 0;
  private isDragging = false;
  private currentHoverTargetId: string | null = null;
  private currentHoverAction: 'pour' | 'fill' | 'empty' | null = null;

  constructor(
    container: HTMLElement,
    handlers: InteractionHandlers,
    initialSelectedId: string | null = null
  ) {
    this.container = container;
    this.handlers = handlers;
    this.selectedVesselId = initialSelectedId;
    this.bindEvents();
    if (this.selectedVesselId) {
      // Wait for DOM paint or apply immediately
      setTimeout(() => this.updateSelectionVisuals(), 0);
    }
  }

  public getSelectedVesselId(): string | null {
    return this.selectedVesselId;
  }

  public setSelectedVesselId(id: string | null) {
    this.selectedVesselId = id;
    this.updateSelectionVisuals();
    this.handlers.onSelect?.(id);
  }

  private updateSelectionVisuals() {
    this.container.querySelectorAll('.vessel-wrapper').forEach((el) => {
      const vId = (el as HTMLElement).dataset.vesselId;
      el.classList.toggle('selected-source', vId === this.selectedVesselId);
    });
  }

  private bindEvents() {
    this.container.addEventListener('pointerdown', this.onPointerDown.bind(this));
    window.addEventListener('pointermove', this.onPointerMove.bind(this));
    window.addEventListener('pointerup', this.onPointerUp.bind(this));
    window.addEventListener('pointercancel', this.onPointerCancel.bind(this));
  }

  public destroy() {
    window.removeEventListener('pointermove', this.onPointerMove.bind(this));
    window.removeEventListener('pointerup', this.onPointerUp.bind(this));
    window.removeEventListener('pointercancel', this.onPointerCancel.bind(this));
  }

  private onPointerDown(e: PointerEvent) {
    // Only accept primary button (left click / touch)
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    // Check if clicked inside a vessel
    const target = (e.target as HTMLElement).closest('.vessel-wrapper') as HTMLElement | null;
    if (!target) {
      // Check if clicked tap or sink when a vessel is selected
      const tapBtn = (e.target as HTMLElement).closest('#puzzle-tap-btn, #tool-tap-btn') as HTMLElement | null;
      if (tapBtn) {
        if (this.selectedVesselId) {
          e.preventDefault();
          const vId = this.selectedVesselId;
          this.setSelectedVesselId(null);
          this.handlers.onFill?.(vId);
        }
        return;
      }
      const sinkBtn = (e.target as HTMLElement).closest('#puzzle-sink-btn, #tool-sink-btn') as HTMLElement | null;
      if (sinkBtn) {
        if (this.selectedVesselId) {
          e.preventDefault();
          const vId = this.selectedVesselId;
          this.setSelectedVesselId(null);
          this.handlers.onEmpty?.(vId);
        }
        return;
      }
      return;
    }

    const vesselId = target.dataset.vesselId;
    if (!vesselId) return;

    // Check tap-to-pour if a vessel is already selected
    if (this.selectedVesselId && this.selectedVesselId !== vesselId) {
      // Pour from selected to this target!
      const from = this.selectedVesselId;
      const to = vesselId;
      this.setSelectedVesselId(null);
      this.handlers.onPour(from, to);
      return;
    }

    // Start tracking potential drag
    this.activePointerId = e.pointerId;
    this.draggedElement = target;
    this.draggedVesselId = vesselId;
    this.startX = e.clientX;
    this.startY = e.clientY;
    this.currentX = e.clientX;
    this.currentY = e.clientY;
    this.isDragging = false;
    this.currentHoverTargetId = null;

    target.setPointerCapture(e.pointerId);
  }

  private onPointerMove(e: PointerEvent) {
    if (this.activePointerId !== e.pointerId || !this.draggedElement) return;

    this.currentX = e.clientX;
    this.currentY = e.clientY;
    const dx = this.currentX - this.startX;
    const dy = this.currentY - this.startY;

    // Threshold to distinguish click vs drag
    if (!this.isDragging && (Math.abs(dx) > 10 || Math.abs(dy) > 10)) {
      this.isDragging = true;
      this.draggedElement.classList.add('is-dragging');
    }

    if (this.isDragging) {
      e.preventDefault();
      // Calculate tilt angle proportional to horizontal movement (max 50 deg)
      const tilt = Math.max(-50, Math.min(50, dx * 0.3));
      this.draggedElement.style.transform = `translate(${dx}px, ${dy}px) rotate(${tilt}deg)`;
      this.draggedElement.style.zIndex = '100';

      // Detect hover over another vessel
      this.checkTargetProximity(e.clientX, e.clientY);
    }
  }

  private checkTargetProximity(x: number, y: number) {
    const vesselElements = this.container.querySelectorAll('.vessel-wrapper');
    let hoveredId: string | null = null;
    let hoveredAction: 'pour' | 'fill' | 'empty' | null = null;

    vesselElements.forEach((el) => {
      const vId = (el as HTMLElement).dataset.vesselId;
      if (vId === this.draggedVesselId) return;

      const rect = el.getBoundingClientRect();
      // Expand hit area for easy touch/mouse targeting
      const isInside =
        x >= rect.left - 20 &&
        x <= rect.right + 20 &&
        y >= rect.top - 20 &&
        y <= rect.bottom + 40;

      if (isInside) {
        hoveredId = vId || null;
        hoveredAction = 'pour';
      }
      el.classList.toggle('valid-target', isInside);
    });

    // Proximity check for Tap tool
    const tapBtn = this.container.querySelector('#puzzle-tap-btn, #tool-tap-btn') as HTMLElement | null;
    if (tapBtn) {
      const rect = tapBtn.getBoundingClientRect();
      const isOverTap =
        x >= rect.left - 20 &&
        x <= rect.right + 20 &&
        y >= rect.top - 20 &&
        y <= rect.bottom + 30;
      tapBtn.classList.toggle('valid-target', isOverTap);
      if (isOverTap) {
        hoveredAction = 'fill';
      }
    }

    // Proximity check for Sink tool
    const sinkBtn = this.container.querySelector('#puzzle-sink-btn, #tool-sink-btn') as HTMLElement | null;
    if (sinkBtn) {
      const rect = sinkBtn.getBoundingClientRect();
      const isOverSink =
        x >= rect.left - 20 &&
        x <= rect.right + 20 &&
        y >= rect.top - 20 &&
        y <= rect.bottom + 30;
      sinkBtn.classList.toggle('valid-target', isOverSink);
      if (isOverSink) {
        hoveredAction = 'empty';
      }
    }

    this.currentHoverTargetId = hoveredId;
    this.currentHoverAction = hoveredAction;
  }

  private onPointerUp(e: PointerEvent) {
    if (this.activePointerId !== e.pointerId) return;

    if (this.draggedElement) {
      if (this.draggedElement.hasPointerCapture(e.pointerId)) {
        this.draggedElement.releasePointerCapture(e.pointerId);
      }

      this.draggedElement.classList.remove('is-dragging');
      this.draggedElement.style.zIndex = '';

      if (this.isDragging) {
        const draggedId = this.draggedVesselId;
        this.resetElementTransform(this.draggedElement);
        this.clearTargetHighlights();

        if (this.currentHoverAction === 'fill' && draggedId) {
          this.handlers.onFill?.(draggedId);
        } else if (this.currentHoverAction === 'empty' && draggedId) {
          this.handlers.onEmpty?.(draggedId);
        } else if (this.currentHoverAction === 'pour' && this.currentHoverTargetId && draggedId) {
          this.handlers.onPour(draggedId, this.currentHoverTargetId);
        } else {
          // Spring back smoothly
          this.springBack(this.draggedElement);
        }
      } else {
        // Simple tap / click without drag
        this.handleTap(this.draggedVesselId!);
      }
    }

    this.cleanupDrag();
  }

  private onPointerCancel(e: PointerEvent) {
    if (this.activePointerId === e.pointerId && this.draggedElement) {
      this.springBack(this.draggedElement);
      this.clearTargetHighlights();
      this.cleanupDrag();
    }
  }

  private handleTap(vesselId: string) {
    if (this.selectedVesselId === vesselId) {
      // Deselect if already selected
      this.setSelectedVesselId(null);
    } else {
      // Select source
      this.setSelectedVesselId(vesselId);
    }
  }

  private springBack(el: HTMLElement) {
    el.style.transition = 'transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    el.style.transform = 'translate(0px, 0px) rotate(0deg)';
    setTimeout(() => {
      el.style.transition = '';
    }, 260);
  }

  private resetElementTransform(el: HTMLElement) {
    el.style.transition = '';
    el.style.transform = 'translate(0px, 0px) rotate(0deg)';
  }

  private clearTargetHighlights() {
    this.container.querySelectorAll('.vessel-wrapper, .tool-tap-container, .tool-sink-container').forEach((el) => {
      el.classList.remove('valid-target');
    });
  }

  private cleanupDrag() {
    this.activePointerId = null;
    this.draggedElement = null;
    this.draggedVesselId = null;
    this.isDragging = false;
    this.currentHoverTargetId = null;
    this.currentHoverAction = null;
  }
}
