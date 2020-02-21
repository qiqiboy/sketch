// Type definitions for sketch-lite
// Project: Sketch-lite
// Definitions by: qiqiboy

declare const SketchLite: SketchLite.SketchLiteConstructor;

export = SketchLite;

export as namespace SketchLite;

declare namespace SketchLite {
    interface SketchLiteConfig {
        color?: string;
        bgcolor?: string;
        lineWidth?: number;
        width?: number;
        height?: number;
        multi?: boolean;
    }

    interface SketchLite {
        color: string;
        bgcolor: string;
        lineWidth: number;
        width: number;
        height: number;
        multi: boolean;
        erase: boolean;
        steps: number;

        canvas: HTMLCanvasElement;
        ctx: CanvasRenderingContext2D;

        clear(): SketchLite;
        cancel(step?: number): SketchLite;
        reDraw(): SketchLite;
        toBlob: HTMLCanvasElement['toBlob'];
        toDataUrl: HTMLCanvasElement['toDataURL'];
        toDataURL: HTMLCanvasElement['toDataURL'];
        destroy(): void;
        
        on(action: 'start' | 'move', callback: (x: number, y: number, pointerId: number) => void): SketchLite;
        on(action: 'end', callback: (pointerId: number) => void): SketchLite;
    }

    interface SketchLiteConstructor {
        new (idOrElement: string | HTMLElement, config?: SketchLiteConfig): SketchLite;
        (idOrElement: string | HTMLElement, config?: SketchLiteConfig): SketchLite;
    }
}
