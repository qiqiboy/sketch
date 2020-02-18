// Type definitions for sketch-lit
// Project: Sketch-lit
// Definitions by: qiqiboy

declare const SketchLit: SketchLit.SketchLitConstructor;

export = SketchLit;

export as namespace SketchLit;

declare namespace SketchLit {
    interface SketchLitConfig {
        color?: string;
        bgColor?: string;
        lineWidth?: number;
        width?: number;
        height?: number;
        multi?: boolean;
    }

    interface SketchLit {
        color: string;
        bgColor: string;
        lineWidth: number;
        width: number;
        height: number;
        multi: boolean;
        erase: boolean;
        steps: number;

        canvas: HTMLCanvasElement;
        ctx: CanvasRenderingContext2D;

        clear(): SketchLit;
        cancel(step?: number): SketchLit;
        toBlob: HTMLCanvasElement['toBlob'];
        toDataUrl: HTMLCanvasElement['toDataURL'];
        toDataURL: HTMLCanvasElement['toDataURL'];
        on(action: 'start' | 'move', callback: (x: number, y: number, pointerId: number) => void): SketchLit;
        on(action: 'end', callback: (pointerId: number) => void): SketchLit;

        destroy(): SketchLit;
    }

    interface SketchLitConstructor {
        new (idOrElement: string | HTMLElement, config?: SketchLitConfig): SketchLit;
        (idOrElement: string | HTMLElement, config?: SketchLitConfig): SketchLit;
    }
}
