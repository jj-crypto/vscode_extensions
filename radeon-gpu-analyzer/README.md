# VSCode: Radeon GPU Analyzer

This is a Visual Studio Code extension for the [Radeon GPU Analyzer](https://github.com/GPUOpen-Tools/RGA) (RGA). It aims to make RGA usable directly from within VSCode. For now RGA 2.3 is supported. Later versions may work out of the box. 

## Features

- View the disassembly from compiling HLSL, SPIR-V and Vulkan (GLSL) shaders down to AMD IL and AMD GCN/RDNA ISA.
- View the disassembly from compiling AMD IL shaders to AMD GCN/RDNA ISA.
- The current word selection is used as entry function of your shader.
- The shader model / shader type and the target architecture are chosen via drop down menus.
- The last command per shader is saved and can be replayed. This allows you to spot the impact your code changes have on the ISA. 
- If you open the shader in a VSCode project, created files will open in a new view.

## Usage

All commands are accessible from the command palette (`Ctrl+Shift+P`).
Supported commands:
- Call RGA: Vulkan
- Call RGA: SPIR-V
- Call RGA: AMD IL
- Call RGA: DX11
- Call RGA: DX12
- Replay RGA (default key binding: `F7`)

E.g. to compile an HLSL shader for the use on RX 5700 XT:
1. Open VSCode in a parent directory of your shader.
2. Open your shader in VSCode.
3. Select the `entry function name` of your shader.
4. `Ctrl+Shift+P`
5. Enter the command "Call RGA: DX12"
6. Choose your preferred shader profile from the drop down. E.g. cs_6_0 for a compute shader on Shader Model 6.0.
7. Choose your preferred target architecture. For RX 5700 XT that would be `gfx1010` - call RGA.exe directly to show the full list of supported ASICs.
8. If your shader compiles successfully, the resulting AMD IL and AMD GCN/RDNA ISA disassembly will open in separate views.

## Notes

- AMD IL does not require an entry point, no need to do step `3` in that case.
- All files are created next to the shader source file.
- RGA will prefix the generated ISA and IL filenames with the name of the GPU family you are compiling for, and the function entry point if that applies.
- RGA does not support AMD IL for DX12 shaders as of version 2.2 - the compiled DXIL is shown instead.  
- DX12 shaders must define and reference the root signature through the [RootSignature()] attribute or use `--rs-bin` as a custom argument.
- Compiling DX12 graphics (= non-compute) pipelines requires to select multiple entry points beforehand. The standard keyboard shortcut in VS Code for multi selection is `Alt`. 
- Compiling DX12 graphics pipelines also requires a `gpso` file that provides additional information about the pipeline. For compute shaders just leave the selection empty.

## Requirements

To use this extension you have to download RGA separately and point to the rga.exe in your settings.
Download RGA from [Github](https://github.com/GPUOpen-Tools/RGA/releases). Note that for now version 2.3 is supported. Later versions may work out of the box. 

## Source

The source code can be found on [Github](https://github.com/GPUOpen-Tools/vscode-extensions/tree/master/radeon-gpu-analyzer). 

## Key Bindings

- `"extension.replayRga"`  - default: `"F7"`

## Settings

- `"rga.path"` Path to the RGA executable.
- `"rga.arguments.dx11"` Define additional arguments to pass to RGA - `DX11`, e.g. `'--intrinsics --UAVSlot 63'`
- `"rga.arguments.dx12"` Define additional arguments to pass to RGA - `DX12`, e.g. `'--intrinsics --UAVSlot 63'`
- `"rga.arguments.vulkan"` Define additional arguments to pass to RGA - `Vulkan`, e.g. `'--cfg control_flow_graph'`
- `"rga.arguments.spirv"` Define additional arguments to pass to RGA - `SPIR-V`, e.g. `'--cfg control_flow_graph'`
- `"rga.arguments.amdil"` Define additional arguments to pass to RGA - `AMD IL`, e.g. `'--cfg control_flow_graph'`
- `"rga.viewColumn.il"` Number of the view column the `output IL` will be shown (1, 2 or 3). Pass in -1 if you don't want to open the IL.
- `"rga.viewColumn.isa"` Number of the view column the `output ISA` will be shown (1, 2 or 3). Pass in -1 if you don't want to open the ISA.

## Release Notes

### 1.1.1
- Use child process to execute commands.

### 1.1.0

- Added support for compiling DX12 compute shaders introduced with RGA 2.2.
- Added support for compiling DX12 graphics pipelines introduced with RGA 2.3.
- Added support for RDNA targets (gfx1010 = Navi10 and gfx1012 = Navi14).
- Removed certain keybindings as they became ambiguous with the introduction of DX12.

### 1.0.1

- Readme fixes.

### 1.0.0

- Initial release.

## License

- This extension is under the MIT license. See [License](https://github.com/GPUOpen-Tools/vscode-extensions/blob/master/LICENSE) file for full license information.
